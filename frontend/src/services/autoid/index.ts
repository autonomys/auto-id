import blake2b from "blake2b";
import { getEnv } from "../../utils/getEnv";
import { jsonSafeParse } from "../../utils/json";
import { createConnection } from "@autonomys/auto-utils";

export type AutoIdInfo = {
  provider: string;
  certificatePem: string;
  uuid: string;
  autoIdDigest: string;
  autoId: string;
};

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

export function getLocalAutoIDs(): AutoIdInfo[] {
  const serializedAutoId = localStorage.getItem("auto-id");

  return serializedAutoId ? jsonSafeParse(serializedAutoId) ?? [] : [];
}

function setLocalAutoIDs(autoIds: AutoIdInfo[]) {
  localStorage.setItem("auto-id", JSON.stringify(autoIds));
}

export function addLocalAutoID(autoId: AutoIdInfo) {
  const autoIds = getLocalAutoIDs() || [];
  autoIds.push(autoId);
  localStorage.setItem("auto-id", JSON.stringify(autoIds));
}

export function removeLocalAutoID(autoId: AutoIdInfo) {
  const autoIds = getLocalAutoIDs() || [];
  const newAutoIds = autoIds.filter((a) => a.autoId !== autoId.autoId);
  setLocalAutoIDs(newAutoIds);
}

export function resetLocalAutoIds() {
  localStorage.removeItem("auto-id");
}
