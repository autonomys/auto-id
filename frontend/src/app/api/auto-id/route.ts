import { NextRequest, NextResponse } from "next/server";
import {
  pemToCertificate,
  registerAutoId,
  stripPemHeaders,
} from "@autonomys/auto-id";
import { ApiPromise, createConnection, Keyring } from "@autonomys/auto-utils";
import { getEnv } from "../../../utils/getEnv";
import { getDomainApi } from "../../../services/autoid";

type RegisterAutoIdRequestBody = {
  certificatePem: string;
};

export type RegisterAutoIdResponseBody =
  | { status: "success" }
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

    return await new Promise<NextResponse<RegisterAutoIdResponseBody>>(
      (resolve) => {
        api
          .tx(submitableExtrinsic)
          .signAndSend(
            keyring,
            ({ status, dispatchError, isInBlock, internalError, txHash }) => {
              if (isInBlock) {
                if (internalError) {
                  resolve(
                    NextResponse.json(
                      {
                        status: "unknownError",
                        message: internalError.message,
                      },
                      { status: 409 }
                    )
                  );
                } else if (dispatchError) {
                  const { index, error } = dispatchError.asModule;
                  const { name } = api.registry.findMetaError({
                    index,
                    error,
                  });

                  resolve(
                    NextResponse.json(
                      {
                        status: "error",
                        errorName: name,
                      },
                      { status: 409 }
                    )
                  );
                } else {
                  resolve(NextResponse.json({ status: "success", txHash }));
                }
              }
            }
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
