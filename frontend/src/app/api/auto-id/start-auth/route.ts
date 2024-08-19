import { Keyring, cryptoWaitReady } from "@autonomys/auto-utils";
import { getEnv } from "../../../../utils/getEnv";
import { NextRequest, NextResponse } from "next/server";
import { Metadata, createMetadata } from "../../../../types/autoScore";
import { metadataSignatureChallenge } from "../../../../services/autoid/challenges";
import { HttpResponse } from "../../../../types/httpResponse";

export type StartAuthResponseBody = HttpResponse<{
  metadata: Metadata;
  signature: string;
}>;

export async function POST(_: NextRequest) {
  try {
    await cryptoWaitReady();

    const keyring = new Keyring({ type: "sr25519" }).addFromUri(getEnv("SEED"));

    const metadata = createMetadata(getEnv("LETSID_SERVER_AUTO_ID"));
    const signature = Buffer.from(
      keyring.sign(metadataSignatureChallenge(metadata))
    ).toString("hex");

    return NextResponse.json<StartAuthResponseBody>({
      success: true,
      data: {
        metadata,
        signature,
      },
    });
  } catch (e) {
    return NextResponse.json<StartAuthResponseBody>({
      success: false,
      error: "Unknown error occurred. Please try again.",
    });
  }
}
