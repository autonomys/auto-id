"use client";

import { useSessionStorage } from "usehooks-ts";
import { SerializableKeypair } from "../../types/keyring";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

function AutoScore() {
  const [keypair] = useSessionStorage<SerializableKeypair | null>(
    "keypair",
    null
  );

  if (!keypair) {
    redirect("/");
  }

  return <>{keypair.hexSecretKey}</>;
}

export default dynamic(() => Promise.resolve(AutoScore), { ssr: false });
