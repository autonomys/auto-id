import { Keyring, cryptoWaitReady } from "@autonomys/auto-utils";
import { getEnv } from "../../../../utils/getEnv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await cryptoWaitReady();

  const keyring = new Keyring({ type: "sr25519" }).addFromUri(getEnv("SEED"));

  const timestamp = Date.now();
  const signature = Buffer.from(keyring.sign(timestamp.toString())).toString(
    "hex"
  );

  return NextResponse.json({
    metadata: {
      timestamp,
    },
    signature,
  });
}
