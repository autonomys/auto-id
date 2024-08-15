import blake2b from "blake2b";
import { getEnv } from "../../utils/getEnv";
import { createConnection } from "@autonomys/auto-utils";

export const getDomainApi = () => {
  const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
  if (!endpoint) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_RPC_ENDPOINT");
  }
  return createConnection(endpoint);
};

export function generateAutoIDDigest(provider: string, uuid: string) {
  const content = getEnv("LETSID_SERVER_AUTO_ID") + provider + uuid;
  return blake2b(32).update(Buffer.from(content)).digest("hex");
}
