"use client";

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AutoIdInfo, getDomainApi } from "../../services/autoid";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import { middleShortenString } from "../../utils/shortenString";
import {
  AutoIdX509Certificate,
  getCertificate,
  pemToCertificate,
} from "@autonomys/auto-id";
import { InputFileWithButtons } from "../../components/InputFileWithButtons";
import blake2b from "blake2b";

export const AutoIdCard = ({
  autoId,
  provider,
  certificatePem,
  uuid: _,
}: PropsWithChildren<AutoIdInfo>) => {
  const [, updateClipboard] = useCopyToClipboard();

  const onClick = useCallback(() => {
    toast("Auto-ID copied to clipboard");
    updateClipboard(autoId);
  }, [autoId]);

  const shortenAutoId = useMemo(
    () => middleShortenString(autoId, 20),
    [autoId]
  );

  const pemCertificate = useMemo(() => {
    if (!certificatePem) return null;
    return pemToCertificate(certificatePem).toString();
  }, [certificatePem]);

  const certificateHash = useMemo(() => {
    if (!pemCertificate) {
      return null;
    }

    return blake2b(16)
      .update(Buffer.from(pemCertificate))
      .digest("hex")
      .slice(0, 8);
  }, [certificatePem]);

  return (
    <div className="flex flex-row border border-black rounded p-4 md:w-[60%] w-9/10 items-center justify-around gap-4 bg-slate-50 px-5">
      <img src="/github.png" className="h-[80px] aspect-square" />
      <div className="flex flex-row gap-2 w-fit-content items-center">
        <div className="text-2xl font-medium">{shortenAutoId}</div>
        <div>
          <Square2StackIcon
            onClick={onClick}
            className="size-6 hover:cursor-pointer"
          />
        </div>
      </div>
      <span className="w-1/3">
        <InputFileWithButtons
          placeholder="Fetching certificate..."
          name={`x509 certificate (${certificateHash})`}
          value={pemCertificate}
          downloadFilename={`cert-${certificateHash}.pem`}
          copyMessage={pemCertificate ?? ""}
        ></InputFileWithButtons>
      </span>
    </div>
  );
};
