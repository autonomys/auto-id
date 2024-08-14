import { NextRequest, NextResponse } from "next/server";
import {
  pemToCertificate,
  registerAutoId,
  stripPemHeaders,
} from "@autonomys/auto-id";
import { ApiPromise, Keyring } from "@autonomys/auto-utils";
import { getEnv } from "../../../utils/getEnv";
import { getDomainApi } from "../../../services/autoid";

type RegisterAutoIdRequestBody = {
  certificatePem: string;
};

export type RegisterAutoIdResponseBody =
  | { status: "success"; signedExtrinsic: string; hash: string }
  | {
      status: "error";
      errorName: string;
    }
  | {
      status: "unknownError";
      message: string;
    };

export async function POST(req: NextRequest) {
  let api: ApiPromise | undefined;
  try {
    const body: RegisterAutoIdRequestBody = await req.json();

    const api = await getDomainApi();

    const submitableExtrinsic = registerAutoId(
      api,
      pemToCertificate(stripPemHeaders(body.certificatePem))
    );

    const keyring = new Keyring({ type: "sr25519" }).addFromUri(getEnv("SEED"));
    if (!keyring) {
      throw new Error("No keyring found");
    }

    // Get current block hash (used as blockHash in transaction)
    const blockHash = await api.rpc.chain.getBlockHash();

    // Get keyring nonce
    const { nonce } = (
      await api.query.system.account(keyring.address)
    ).toJSON() as { nonce: number };

    return await new Promise<NextResponse<RegisterAutoIdResponseBody>>(
      async (resolve) => {
        const signedExtrinsic = await api
          .tx(submitableExtrinsic)
          .signAsync(keyring, {
            nonce,
            blockHash,
          });

        return resolve(
          NextResponse.json({
            status: "success",
            signedExtrinsic: signedExtrinsic.toHex(),
            hash: signedExtrinsic.hash.toHex(),
          })
        );
      }
    ).finally(() => {
      api?.disconnect();
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Unknow error" }, { status: 409 });
  } finally {
    api?.disconnect();
  }
}
