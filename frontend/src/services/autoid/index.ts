import blake2b from "blake2b";
import { getEnv } from "../../utils/getEnv";
import { jsonSafeParse } from "../../utils/json";

export type AutoId = {
  provider: string;
  uuid: string;
  autoId: string;
};

export function generateAutoID(provider: string, uuid: string) {
  const content = getEnv("LETSID_SERVER_AUTO_ID") + provider + uuid;
  return blake2b(32).update(Buffer.from(content)).digest("hex");
}

export function getLocalAutoIDs(): AutoId[] {
  const serializedAutoId = localStorage.getItem("auto-id");

  return serializedAutoId ? jsonSafeParse(serializedAutoId) ?? [] : [];
}

function setLocalAutoIDs(autoIds: AutoId[]) {
  localStorage.setItem("auto-id", JSON.stringify(autoIds));
}

export function addLocalAutoID(autoId: AutoId) {
  const autoIds = getLocalAutoIDs() || [];
  autoIds.push(autoId);
  localStorage.setItem("auto-id", JSON.stringify(autoIds));
}

export function removeLocalAutoID(autoId: AutoId) {
  const autoIds = getLocalAutoIDs() || [];
  const newAutoIds = autoIds.filter((a) => a.autoId !== autoId.autoId);
  setLocalAutoIDs(newAutoIds);
}

export function resetLocalAutoIds() {
  localStorage.removeItem("auto-id");
}
