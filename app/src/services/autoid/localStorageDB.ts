import { SignedAutoScore } from "../../types/autoId";
import { useLocalStorage } from "usehooks-ts";
import { useCallback } from "react";

export type LinkedApp = {
  provider: string;
  url: string;
};

export type AutoIdInfo = {
  provider: string;
  certificatePem: string;
  uuid: string;
  autoIdDigest: string;
  autoId: string;
  autoScore?: SignedAutoScore;
  linkedApps?: LinkedApp[];
};

export function useLocalAutoIDs(): AutoIdInfo[] {
  const [autoIDs] = useLocalStorage<AutoIdInfo[]>("auto-id", []);

  return autoIDs;
}

function useSetLocalAutoIDs() {
  const [, setAutoIDs] = useLocalStorage<AutoIdInfo[]>("auto-id", []);

  return useCallback(
    (autoIds: AutoIdInfo[]) => setAutoIDs(autoIds),
    [setAutoIDs]
  );
}

export function useAddLocalAutoID() {
  const [autoIDs, setAutoIDs] = useLocalStorage<AutoIdInfo[]>("auto-id", []);

  return useCallback(
    (autoId: AutoIdInfo) => {
      setAutoIDs([...autoIDs, autoId]);
    },
    [autoIDs]
  );
}

export function removeLocalAutoID(autoId: AutoIdInfo) {
  const autoIds = useLocalAutoIDs();
  const newAutoIds = autoIds.filter((a) => a.autoId !== autoId.autoId);
  const setLocalAutoIds = useSetLocalAutoIDs();

  return useCallback(() => {
    setLocalAutoIds(newAutoIds);
  }, [newAutoIds]);
}

export function resetLocalAutoIds() {
  const setLocalAutoIds = useSetLocalAutoIDs();

  return useCallback(() => {
    setLocalAutoIds([]);
  }, []);
}

export function useUpdateAutoScore() {
  const autoIds = useLocalAutoIDs();
  const setLocalAutoIds = useSetLocalAutoIDs();

  return useCallback(
    (autoId: string, autoScore: SignedAutoScore) => {
      const newAutoIds = autoIds.map((a) =>
        a.autoId === autoId ? { ...a, autoScore } : a
      );
      setLocalAutoIds(newAutoIds);
    },
    [autoIds]
  );
}

export function useAddLinkedApp() {
  const autoIds = useLocalAutoIDs();
  const setLocalAutoIds = useSetLocalAutoIDs();

  return useCallback(
    (autoId: string, linkedApp: LinkedApp) => {
      const newAutoIds = autoIds.map((a) =>
        a.autoId === autoId
          ? { ...a, linkedApps: [...(a.linkedApps ?? []), linkedApp] }
          : a
      );
      setLocalAutoIds(newAutoIds);
    },
    [autoIds]
  );
}
