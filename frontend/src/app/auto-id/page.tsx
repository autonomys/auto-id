"use client";

import { useSessionStorage } from "usehooks-ts";
import { HexPrivateKey } from "../../types/keyring";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { PlusIcon, Square2StackIcon } from "@heroicons/react/24/outline";
import { getLocalAutoIDs } from "../../services/autoid";
import { AutoIdCard } from "./AutoIdCard";

function AutoScore() {
  const [keypair] = useSessionStorage<HexPrivateKey | null>("keypair", null);

  if (!keypair) {
    redirect("/");
  }

  const autoIDs = getLocalAutoIDs();

  return (
    <div className="flex flex-col h-full w-full items-center mt-[200px] gap-2">
      <div className="md:w-[60%] w-1/10 mb-5">
        <a
          href={`${window.location.pathname}/create`}
          className={`text-white bg-primary py-1 px-4 rounded-md text-xl hover:opacity-80 hover:scale-101 flex items-center gap-1 w-content`}
        >
          NEW
          <PlusIcon className="size-5" />
        </a>
      </div>
      {autoIDs.map((autoIdInfo) => (
        <AutoIdCard {...autoIdInfo} />
      ))}
    </div>
  );
}

export default dynamic(() => Promise.resolve(AutoScore), { ssr: false });
