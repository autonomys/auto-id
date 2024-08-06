import { useSessionStorage } from "usehooks-ts";
import type { Keypair as TKeyring } from "@/types/keyring";
import { Keyring } from "@autonomys/auto-utils";
import { useMemo } from "react";

export const useKeyring = () => {
  const [keyring] = useSessionStorage<TKeyring | null>("keyring", null);

  return useMemo(() => {
    if (keyring) {
      const kr = new Keyring();
      kr.addFromMnemonic(keyring.data);
      return kr;
    }

    return null;
  }, [keyring]);
};
