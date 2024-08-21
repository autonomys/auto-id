import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { BlurredBackground } from "../components/BlurredBackground";

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
        <Toaster position="bottom-center" />
        <div className="h-screen w-screen flex-col">
          <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2 mt-2">
            <img src="/autonomys.png" alt="Autonomys" className="h-full" />
            <h1 className="text-4xl">Autonomys</h1>
          </header>
          <main
            className={`h-[92.5%] w-full flex justify-center items-center relative`}
          >
            {children}
            <BlurredBackground />
          </main>
        </div>
      </body>
    </html>
  );
}
