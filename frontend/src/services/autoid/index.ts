import blake2b from "blake2b";
import { getEnv } from "../../utils/getEnv";

export function generateAutoID(provider: string, uuid: string) {
  const content = getEnv("LETSID_SERVER_AUTO_ID") + provider + uuid;
  return blake2b(32).update(Buffer.from(content)).digest("hex");
}
