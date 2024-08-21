import { Keyring, cryptoWaitReady } from "@autonomys/auto-utils";
import { getEnv } from "../../../../utils/getEnv";
import { NextRequest, NextResponse } from "next/server";
import { Metadata, createMetadata } from "../../../../types/autoScore";
import { metadataSignatureChallenge } from "../../../../services/autoid/challenges";
import { HttpResponse } from "../../../../types/httpResponse";
import { crypto, pemToPrivateKey } from "@autonomys/auto-id";

export type StartAuthResponseBody = HttpResponse<{
  metadata: Metadata;
  signature: string;
}>;

export async function POST(_: NextRequest) {
  try {
    await cryptoWaitReady();

    const algorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    };

    const privateKey = await pemToPrivateKey(
      getEnv("LETSID_SERVER_PRIVATE_KEY"),
      algorithm
    );

    const metadata = createMetadata(getEnv("LETSID_SERVER_AUTO_ID"));
    const signature = Buffer.from(
      await crypto.subtle.sign(
        algorithm,
        privateKey,
        metadataSignatureChallenge(metadata)
      )
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
