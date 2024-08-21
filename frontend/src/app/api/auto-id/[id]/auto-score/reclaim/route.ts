import { buildReclaimRequest, SupportedClaimHashes } from "@autonomys/auto-id";
import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "../../../../../../utils/getEnv";

export interface ReclaimRequestBody {
  claimHash: SupportedClaimHashes;
}

export interface ReclaimResponseBody {
  requestUrl: string;
  statusUrl: string;
}

export const POST = async (req: NextRequest) => {
  const { claimHash } = (await req.json()) as ReclaimRequestBody;

  const reclaimRequest = await buildReclaimRequest(
    getEnv("RECLAIM_APP_ID"),
    claimHash
  );

  reclaimRequest.setSignature(
    await reclaimRequest.generateSignature(getEnv("RECLAIM_APP_SECRET"))
  );

  const { requestUrl, statusUrl } =
    await reclaimRequest.createVerificationRequest();

  return NextResponse.json<ReclaimResponseBody>(
    { requestUrl, statusUrl },
    { status: 200 }
  );
};
