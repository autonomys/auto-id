import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auto-Score",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed w-screen h-screen z-back bg-gradient-to-br from-blue-100 via-white to-green-100" />
        <Toaster position="bottom-center" />
        <div className="h-screen w-screen flex flex-col items-center">
          <header className="flex flex-col gap-1 items-center p-2 font-semibold text-[#929EEA] ml-2 justify-center md:w-[60%] w-[80%]">
            <h3 className="opacity-70">
              Auto-ID powered by
            </h3>
            <div className="flex flex-row h-8 items-center gap-2">
              <img src="/autonomys.png" alt="Autonomys" className="h-full" />
              <h1 className="text-4xl">Autonomys</h1>
            </div>
          </header>
          <main
            className={`h-[92.5%] w-full flex justify-center items-center relative`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
