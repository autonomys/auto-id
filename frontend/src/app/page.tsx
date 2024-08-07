import { BlurredBackground } from "@/components/BlurredBackground";
import { Metadata } from "next";
import { AppWrapper } from "../components/AppWrapper";

export const metadata: Metadata = {
  title: "Auto-ID",
  description:
    "The decentralised system for digital identity leveraged by Autonomys network.",
};

export default function Home() {
  return (
    <AppWrapper>
      <div className="flex flex-col border border-black rounded p-4 md:w-[40%] min-h-[40%] w-9/10 justify-around items-center gap-4 bg-slate-50">
        <h2 className="text-3xl">Auto-ID</h2>
        <p className="text-blue text-center text-slate-500 w-4/5">
          A decentralised system for digital identity leveraged by Autonomys
          network, for more info visit our{" "}
          <a
            className="underline"
            href="https://academy.autonomys.xyz/autonomys-solutions/autoid"
            target="_blank"
          >
            docs
          </a>
          .
        </p>
        <a
          className="font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101"
          href="./login"
        >
          Start
        </a>
      </div>
    </AppWrapper>
  );
}
