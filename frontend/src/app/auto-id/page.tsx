"use client";

import { useSessionStorage } from "usehooks-ts";
import { SerializableKeypair } from "../../types/keyring";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { AppWrapper } from "../../components/AppWrapper";

function AutoScore() {
  const [keypair] = useSessionStorage<SerializableKeypair | null>(
    "keypair",
    null
  );

  if (!keypair) {
    redirect("/");
  }

  return (
    <AppWrapper extendedClassName="flex-col gap-2">
      <div className="md:w-[60%] w-9/10">
        <button
          onClick={() => {}}
          className={`text-white bg-primary py-1 px-4 rounded-md text-xl hover:opacity-80 hover:scale-101 flex items-center gap-1`}
        >
          NEW
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col border border-black rounded p-4 md:w-[60%] min-h-[60%] w-9/10 justify-around items-center gap-4 bg-slate-50">
        hola
      </div>
    </AppWrapper>
  );
}

export default dynamic(() => Promise.resolve(AutoScore), { ssr: false });
