"use client";

import { useSessionStorage } from "usehooks-ts";
import { HexPrivateKey } from "../../types/keyring";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { PlusIcon, } from "@heroicons/react/24/outline";
import { AutoIdCard } from "../../components/AutoIdCard";
import { useLocalAutoIDs } from "../../services/autoid/localStorageDB";
import useResetAutoScore from "../../hooks/resetAutoScore";
import { useEffect } from "react";

function AutoScore() {
  const [keypair] = useSessionStorage<HexPrivateKey | null>("keypair", null);

  if (!keypair) {
    redirect("/");
  }

  const resetAutoScore = useResetAutoScore()
  useEffect(() => {
    resetAutoScore();
  }, [resetAutoScore]);

  const autoIDs = useLocalAutoIDs();

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
      {
        autoIDs.length > 0 ?
          autoIDs.map((autoIdInfo) => (
            <AutoIdCard {...autoIdInfo} />
          ))
          : <div className="flex flex-col ring-1 ring-black ring-opacity-10 rounded p-4 md:w-[60%] w-[80%] bg-white items-center gap-4 text-slate-500">
            You have no Auto-IDs, press the button above to create one.
          </div>
      }
    </div>
  );
}

export default dynamic(() => Promise.resolve(AutoScore), { ssr: false });
