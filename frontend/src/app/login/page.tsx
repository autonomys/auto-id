"use client";
import { LogIn } from "@/components/LogIn";
import { CreateKeyring } from "@/components/CreateKeyring";
import type { EncryptedKeypair } from "@/types/keyring";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { BlurredBackground } from "@/components/BlurredBackground";
import Image from "next/image";
import dynamic from "next/dynamic";

function Login() {
  const [hasEncryptedKeyring, setHasEncryptedKeyring] = useState<
    boolean | undefined
  >(undefined);

  const [encryptedKeyring] = useLocalStorage<EncryptedKeypair | null>(
    "encrypted-keyring",
    null
  );
  const [keyring] = useSessionStorage("keyring", null);

  useEffect(() => {
    if (keyring) {
      redirect("/auto-score");
    }
  }, [keyring]);

  useEffect(() => {
    setHasEncryptedKeyring(!!encryptedKeyring);
  }, [encryptedKeyring]);

  return (
    <div className="h-screen w-screen flex-col">
      <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2 mt-2">
        <img src="/autonomys.png" alt="Autonomys" className="h-full" />
        <h1 className="text-4xl">Autonomys</h1>
      </header>
      <main className="h-[92.5%] w-full flex justify-center items-center relative">
        {hasEncryptedKeyring === undefined && <>Loading...</>}
        {hasEncryptedKeyring === false && <CreateKeyring />}
        {hasEncryptedKeyring === true && <LogIn />}
        <BlurredBackground />
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
