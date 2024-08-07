"use client";
import { LogIn } from "@/components/LogIn";
import { CreateKeypair } from "@/components/CreateKeypair";
import type { EncryptedKeypair } from "@/types/keyring";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { AppWrapper } from "@/components/AppWrapper";

function Login() {
  const [hasEncryptedKeypair, setHasEncryptedKeypair] = useState<
    boolean | undefined
  >(undefined);

  const [encryptedKeypair] = useLocalStorage<EncryptedKeypair | null>(
    "encrypted-keypair",
    null
  );
  const [keypair] = useSessionStorage("keypair", null);

  useEffect(() => {
    if (keypair) {
      redirect("/auto-id");
    }
  }, [keypair]);

  useEffect(() => {
    setHasEncryptedKeypair(!!encryptedKeypair);
  }, [encryptedKeypair]);

  return (
    <AppWrapper>
      {hasEncryptedKeypair === undefined && <>Loading...</>}
      {hasEncryptedKeypair === false && <CreateKeypair />}
      {hasEncryptedKeypair === true && <LogIn />}
    </AppWrapper>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
