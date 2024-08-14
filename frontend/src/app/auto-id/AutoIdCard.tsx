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
    () => middleShortenString(autoId, 12),
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

  const InputFileWithButtonsComp = useMemo(
    () => (
      <InputFileWithButtons
        placeholder="Fetching certificate..."
        name={`x509 certificate (${certificateHash})`}
        value={pemCertificate}
        downloadFilename={`cert-${certificateHash}.pem`}
        copyMessage={"Certificate in PEM format copied to clipboard"}
      />
    ),
    [certificateHash, pemCertificate]
  );

  return (
    <div className="flex flex-col border border-black rounded p-4 md:w-[60%] w-[80%] bg-slate-50 items-center gap-4">
      <div className="flex flex-row items-center justify-around gap-4 w-full">
        <img
          src={getProviderImageUrl(provider)}
          className="h-[80px] max-w-[33%] aspect-square"
        />
        <div className="flex flex-row gap-2 w-fit-content items-center">
          <div className="text-lg md:text-2xl font-medium">{shortenAutoId}</div>
          <div>
            <Square2StackIcon
              onClick={onClick}
              className="size-6 hover:cursor-pointer"
            />
          </div>
        </div>
        <span className="w-1/3 hidden md:block">
          {InputFileWithButtonsComp}
        </span>
      </div>
      <span className="w-full md:hidden block">{InputFileWithButtonsComp}</span>
    </div>
  );
};

const getProviderImageUrl = (provider: string) => {
  switch (provider) {
    case "google":
      return "/google.png";
    case "discord":
      return "/discord.png";
    case "github":
      return "/github.png";
    default:
      return "";
  }
};
