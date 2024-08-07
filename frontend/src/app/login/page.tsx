"use client";
import { LogIn } from "@/components/LogIn";
import { CreateKeypair } from "@/components/CreateKeypair";
import type { EncryptedKeypair } from "@/types/keyring";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { BlurredBackground } from "@/components/BlurredBackground";
import dynamic from "next/dynamic";

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
      redirect("/auto-score");
    }
  }, [keypair]);

  useEffect(() => {
    setHasEncryptedKeypair(!!encryptedKeypair);
  }, [encryptedKeypair]);

  return (
    <div className="h-screen w-screen flex-col">
      <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2 mt-2">
        <img src="/autonomys.png" alt="Autonomys" className="h-full" />
        <h1 className="text-4xl">Autonomys</h1>
      </header>
      <main className="h-[92.5%] w-full flex justify-center items-center relative">
        {hasEncryptedKeypair === undefined && <>Loading...</>}
        {hasEncryptedKeypair === false && <CreateKeypair />}
        {hasEncryptedKeypair === true && <LogIn />}
        <BlurredBackground />
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Login), { ssr: false });
