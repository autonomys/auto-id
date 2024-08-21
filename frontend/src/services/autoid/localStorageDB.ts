import { ZkpClaimJSON } from "@autonomys/auto-id";
import { jsonSafeParse } from "../../utils/json";
import { SignedAutoScore } from "../../types/autoId";

export type AutoIdInfo = {
  provider: string;
  certificatePem: string;
  uuid: string;
  autoIdDigest: string;
  autoId: string;
  autoScore?: SignedAutoScore;
};

export function getLocalAutoIDs(): AutoIdInfo[] {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available");
  }

  const serializedAutoId = localStorage.getItem("auto-id");

  return serializedAutoId ? jsonSafeParse(serializedAutoId) ?? [] : [];
}

function setLocalAutoIDs(autoIds: AutoIdInfo[]) {
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available");
  }

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
  if (typeof window === "undefined") {
    throw new Error("localStorage is not available");
  }

  localStorage.removeItem("auto-id");
}

export function updateAutoScore(autoId: string, autoScore: SignedAutoScore) {
  const autoIds = getLocalAutoIDs() || [];
  const newAutoIds = autoIds.map((a) =>
    a.autoId === autoId ? { ...a, autoScore } : a
  );
  setLocalAutoIDs(newAutoIds);
}
