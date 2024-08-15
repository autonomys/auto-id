import { jsonSafeParse } from "../../utils/json";

export type AutoIdInfo = {
  provider: string;
  certificatePem: string;
  uuid: string;
  autoIdDigest: string;
  autoId: string;
};

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
