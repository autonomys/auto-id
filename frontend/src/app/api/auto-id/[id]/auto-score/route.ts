import { NextRequest, NextResponse } from "next/server";
import { Metadata, signableMetadata } from "../../../../../types/autoScore";
import { getEnv } from "../../../../../utils/getEnv";
import {
  Keyring,
  cryptoWaitReady,
  signatureVerify,
} from "@autonomys/auto-utils";
import {
  authenticateAutoIdUser,
  constructZkpClaim,
  ZkpClaimJSON,
} from "@autonomys/auto-id";
import { getDomainApi } from "../../../../../services/autoid/misc";
import blake2b from "blake2b";
import { ZkpClaimRepository } from "../../../../../repositories/ZkpClaim";

interface IssueAutoScoreRequestBody {
  metadata: Metadata;
  signedTimestamp: string;
  userAutoId: string;
  userSignature: string;
  webZKPserviceId: string;
  signedWebZKProof: ZkpClaimJSON;
}

const FIVE_MINUTES = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    await cryptoWaitReady();
    const {
      metadata,
      signedTimestamp,
      userAutoId,
      userSignature,
      signedWebZKProof,
    }: IssueAutoScoreRequestBody = await req.json();

    const keyring = new Keyring({ type: "sr25519" }).addFromUri(getEnv("SEED"));

    // @to-do: Uncomment this after testing

    if (Date.now() - metadata.timestamp > FIVE_MINUTES) {
      return NextResponse.json(
        { error: "Timestamp is too old" },
        { status: 403 }
      );
    }

    const isMetadataSignedCorrectly = signatureVerify(
      new TextEncoder().encode(signableMetadata(metadata)),
      Buffer.from(signedTimestamp, "hex"),
      keyring.publicKey
    ).isValid;
    if (!isMetadataSignedCorrectly) {
      return NextResponse.json(
        { error: "Metadata is not signed correctly." },
        { status: 403 }
      );
    }

    const api = await getDomainApi();
    const userSignatureDigest = blake2b(32).digest(
      Buffer.from(signedTimestamp, "hex")
    );
    const userSignatureBuffer = Buffer.from(userSignature, "hex");

    const isUserSignatureCorrect = await authenticateAutoIdUser(
      api,
      userAutoId,
      userSignatureDigest,
      userSignatureBuffer
    );

    if (!isUserSignatureCorrect) {
      return NextResponse.json(
        { error: "User signature challenge failed." },
        { status: 403 }
      );
    }

    const claim = constructZkpClaim(signedWebZKProof);
    const isZKPValid = await claim.verify(api);
    if (!isZKPValid) {
      return NextResponse.json({ error: "ZKP is not valid." }, { status: 403 });
    }

    const claimUUID = claim.getUID();

    const zkpClaimRepository = new ZkpClaimRepository();

    const isUUIDRepeated =
      (await zkpClaimRepository.getByUUID(claimUUID)) !== null;

    if (isUUIDRepeated) {
      return NextResponse.json(
        { error: "Claim with this UUID already exists." },
        { status: 403 }
      );
    }

    await zkpClaimRepository.save(claimUUID, userAutoId, signedWebZKProof);
    const usersClaims = await zkpClaimRepository.getByAutoId(userAutoId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
