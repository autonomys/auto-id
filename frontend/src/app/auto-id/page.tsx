"use client";

import { useSessionStorage } from "usehooks-ts";
import { HexPrivateKey } from "../../types/keyring";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";

function AutoScore() {
  const [keypair] = useSessionStorage<HexPrivateKey | null>("keypair", null);

  if (!keypair) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-2">
      <div className="md:w-[60%] w-1/10">
        <a
          href={`${window.location.pathname}/create`}
          className={`text-white bg-primary py-1 px-4 rounded-md text-xl hover:opacity-80 hover:scale-101 flex items-center gap-1 w-content`}
        >
          NEW
          <PlusIcon className="size-5" />
        </a>
      </div>
      <div className="flex flex-col border border-black rounded p-4 md:w-[60%] min-h-[60%] w-9/10 items-center gap-4 bg-slate-50">
        hola
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(AutoScore), { ssr: false });
