import { BlurredBackground } from "@/components/BlurredBackground";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auto-ID",
  description:
    "The decentralised system for digital identity leveraged by Autonomys network.",
};

export default function Home() {
  return (
    <div className="h-screen w-screen flex-col">
      <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2 mt-2">
        <img src="/autonomys.png" alt="Autonomys" className="h-full" />
        <h1 className="text-4xl">Autonomys</h1>
      </header>
      <BlurredBackground />
      <main className="h-[92.5%] w-full flex justify-center items-center relative">
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
      </main>
    </div>
  );
}
