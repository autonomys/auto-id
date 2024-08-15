import { Keyring, cryptoWaitReady } from "@autonomys/auto-utils";
import { getEnv } from "../../../../utils/getEnv";
import { NextRequest, NextResponse } from "next/server";
import { createMetadata, signableMetadata } from "../../../../types/autoScore";

export async function POST(req: NextRequest) {
  await cryptoWaitReady();

  const keyring = new Keyring({ type: "sr25519" }).addFromUri(getEnv("SEED"));

  const metadata = createMetadata(getEnv("LETSID_SERVER_AUTO_ID"));
  const signature = Buffer.from(
    keyring.sign(signableMetadata(metadata))
  ).toString("hex");

  return NextResponse.json({
    metadata,
    signature,
  });
}
