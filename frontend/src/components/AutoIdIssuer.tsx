"use client";
import { useCallback, useState } from "react";
import { InputFileWithButtons } from "./InputFileWithButtons";
import { InputWithCopyButton } from "./InputWithCopyButton";
import { redirect } from "next/navigation";

export interface AutoIdIssuerProps {
  autoId: string;
}

export default function AutoIdIssuer({ autoId }: AutoIdIssuerProps) {
  const [certificate, setCertificate] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<boolean>(false);

  const onIssueCertificate = useCallback(() => {
    setCertificate(
      // To-do: generate a valid certificate
      "-----BEGIN CERTIFICATE-----\n\nMIIFSDCCBDCg........................................\n\n-----END CERTIFICATE-----"
    );
  }, []);

  const onIssueAutoId = useCallback(() => {
    setIssuing(true);

    // To-do: issue the Auto-ID
    setTimeout(() => {
      setIssuing(false);
      window.location.assign("/auto-id");
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col border border-black rounded md:w-[60%] min-h-[60%] w-9/10 items-center justify-between gap-4 bg-slate-50">
      <div className="w-1/3 flex flex-col gap-4 p-4">
        <h1 className="text-2xl text-center mb-8">Auto-ID Preview</h1>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <p>Auto-ID</p>
          </div>
          <InputWithCopyButton value={autoId} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <p>Certificate</p>
          </div>
          <InputFileWithButtons
            value={certificate}
            name="Certificate"
            placeholder={"No certificate"}
            copyMessage="Certificate copied to clipboard"
          />
        </div>
      </div>
      <div className="p-8">
        {certificate && (
          <button
            onClick={onIssueAutoId}
            className="font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101 text-nowrap"
          >
            {issuing ? "Issuing..." : "Issue Auto-ID"}
          </button>
        )}
        {certificate === null && (
          <button
            onClick={onIssueCertificate}
            className="font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101 text-nowrap"
          >
            Issue Certificate
          </button>
        )}
      </div>
    </div>
  );
}
