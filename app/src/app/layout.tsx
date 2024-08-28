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
        <div className="h-screen w-screen flex-col">
          <header className="flex flex-row gap-2 items-center h-[7.5%] p-2 font-semibold text-[#929EEA] ml-2">
            <img src="/autonomys.png" alt="Autonomys" className="h-full" />
            <h1 className="text-4xl">Autonomys</h1>
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
