import { NextRequest, NextResponse } from "next/server";
import { Metadata } from "../../../../../types/autoScore";
import { getEnv } from "../../../../../utils/getEnv";
import {
  authenticateAutoIdUser,
  constructZkpClaim,
  crypto,
  cryptoKeyPairFromPrivateKey,
  pemToPrivateKey,
  ZkpClaimJSON,
} from "@autonomys/auto-id";
import {
  autoScoreSignatureChallenge,
  metadataSignatureChallenge,
  userSignatureChallenge,
} from "../../../../../services/autoid/challenges";
import { getDomainApi } from "../../../../../services/autoid/misc";
import { ZkpClaimRepository } from "../../../../../repositories/ZkpClaim";
import {
  SignableAutoScoreClaim,
  SignedAutoScore,
} from "../../../../../types/autoId";
import { HttpResponse } from "../../../../../types/httpResponse";

export interface IssueAutoScoreRequestBody {
  metadata: Metadata;
  signedTimestamp: string;
  userAutoId: string;
  userSignature: string;
  webZKPserviceId: string;
  signedWebZKProof: Omit<ZkpClaimJSON, "serviceId">;
}
export type IssueAutoScoreResponseBody = HttpResponse<SignedAutoScore>;

const FIVE_MINUTES = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const {
      metadata,
      signedTimestamp,
      userAutoId,
      userSignature,
      signedWebZKProof,
    }: IssueAutoScoreRequestBody = await req.json();

    if (Date.now() - metadata.timestamp > FIVE_MINUTES) {
      return NextResponse.json<IssueAutoScoreResponseBody>(
        { error: "Timestamp is too old", success: false },
        { status: 403 }
      );
    }

    /// Check if the timestamp is signed correctly
    const algorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    };
    const privateKey = await pemToPrivateKey(
      getEnv("LETSID_SERVER_PRIVATE_KEY"),
      algorithm
    );
    const { publicKey } = await cryptoKeyPairFromPrivateKey(
      privateKey,
      algorithm
    );

    const isMetadataSignedCorrectly = await crypto.subtle.verify(
      algorithm,
      publicKey,
      Buffer.from(signedTimestamp, "hex"),
      metadataSignatureChallenge(metadata)
    );
    if (!isMetadataSignedCorrectly) {
      return NextResponse.json<IssueAutoScoreResponseBody>(
        { error: "Metadata is not signed correctly.", success: false },
        { status: 403 }
      );
    }

    /// Check if the user signature is correct
    const api = await getDomainApi();
    const userSignatureDigest = userSignatureChallenge(signedTimestamp);
    const userSignatureBuffer = Buffer.from(userSignature, "hex");

    const isUserSignatureCorrect = await authenticateAutoIdUser(
      api,
      userAutoId,
      userSignatureDigest,
      userSignatureBuffer
    );
    if (!isUserSignatureCorrect) {
      return NextResponse.json<IssueAutoScoreResponseBody>(
        { error: "User signature challenge failed.", success: false },
        { status: 403 }
      );
    }

    /// Check if the ZKP is correct
    const webZKPProof = {
      ...signedWebZKProof,
      serviceId: getEnv("LETSID_SERVER_AUTO_ID"),
    };
    const claim = constructZkpClaim(webZKPProof);
    const isZKPValid = await claim.verify(api);
    if (!isZKPValid) {
      return NextResponse.json<IssueAutoScoreResponseBody>(
        { error: "ZKP is not valid.", success: false },
        { status: 403 }
      );
    }

    /// @todo: Remove this check as shoule be occuring in the claim verification
    ///  once the domain supports ZKP claims
    const claimUUID = claim.getUID();
    const zkpClaimRepository = new ZkpClaimRepository();

    const isUUIDRepeated =
      (await zkpClaimRepository.getByUUID(claimUUID)) !== null;

    if (isUUIDRepeated) {
      return NextResponse.json<IssueAutoScoreResponseBody>(
        { error: "Claim with this UUID already exists.", success: false },
        { status: 409 }
      );
    }

    await zkpClaimRepository.save(claimUUID, userAutoId, webZKPProof);
    const claims = await zkpClaimRepository.getByAutoId(userAutoId);

    /// First approach to calculate the auto-score
    const score = Math.min(100, 33 * claims.length);

    /// Construct signable claims
    const zkpClaims = claims.map((claim) => constructZkpClaim(claim.claim));

    const signableClaims: SignableAutoScoreClaim[] = zkpClaims.map((claim) => ({
      claimHash: claim.claimHash,
      type: claim.type,
      uuid: claim.getUID(),
      proof: claim.proof,
    }));

    // return auto-score signed object
    const signableAutoScoreData = {
      score,
      serviceId: getEnv("LETSID_SERVER_AUTO_ID"),
    };
    const autoScoreDigest = autoScoreSignatureChallenge({
      score,
      serviceId: getEnv("LETSID_SERVER_AUTO_ID"),
    });
    const signature = await crypto.subtle.sign(
      algorithm,
      privateKey,
      autoScoreDigest
    );

    const autoScore: SignedAutoScore = {
      data: signableAutoScoreData,
      signature: Buffer.from(signature).toString("hex"),
      claims: signableClaims.map((claim) => ({
        claimHash: claim.claimHash,
        uuid: claim.uuid,
      })),
    };

    return NextResponse.json<IssueAutoScoreResponseBody>({
      success: true,
      data: autoScore,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json<IssueAutoScoreResponseBody>(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
