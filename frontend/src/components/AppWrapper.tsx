import { ReactNode } from "react";
import { BlurredBackground } from "./BlurredBackground";

export const AppWrapper = ({
  children,
  extendedClassName = "",
}: {
  children: ReactNode;
  extendedClassName?: string;
}) => {
  return (
    <div className="h-screen w-screen flex-col">
      <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2 mt-2">
        <img src="/autonomys.png" alt="Autonomys" className="h-full" />
        <h1 className="text-4xl">Autonomys</h1>
      </header>
      <main
        className={`h-[92.5%] w-full flex justify-center items-center relative ${extendedClassName}`}
      >
        {children}
        <BlurredBackground />
      </main>
    </div>
  );
};
