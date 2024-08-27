"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InputFileWithButtons } from "./InputFileWithButtons";
import { useSessionStorage } from "usehooks-ts";
import {
  pemToPrivateKey,
  createAndSignCSR,
  cryptoKeyPairFromPrivateKey,
  issueCertificate,
} from "@autonomys/auto-id";
import { InputWithCopyButton } from "./InputWithCopyButton";
import { HexPrivateKey } from "../types/keyring";
import blake2b from "blake2b";
import { RegisterAutoIdResponseBody } from "../app/api/auto-id/route";
import { getDomainApi } from "../services/autoid/misc";
import toast from "react-hot-toast";
import { useAddLocalAutoID } from "../services/autoid/localStorageDB";
import { handleHttpResponse } from "../utils/http";

export interface AutoIdIssuerProps {
  autoIdDigest: string;
  provider: string;
  uuid: string;
}

export default function AutoIdIssuer({
  autoIdDigest,
  provider,
  uuid,
}: AutoIdIssuerProps) {
  const [certificate, setCertificate] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<boolean>(false);
  const addAutoId = useAddLocalAutoID();

  const [keypairPem] = useSessionStorage<HexPrivateKey | null>("keypair", null);
  const [issuingError, setIssuingError] = useState<
    | (RegisterAutoIdResponseBody &
      ({ status: "error" } | { status: "unknownError" }))
    | null
  >(null);

  const onIssueCertificate = useCallback(async () => {
    console.log(keypairPem.data);

    if (!keypairPem?.data) {
      throw new Error("No keypair found");
    }
    const algorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    };

    const privateKey = await pemToPrivateKey(keypairPem.data, algorithm);

    const keyPair = await cryptoKeyPairFromPrivateKey(privateKey, algorithm);

    createAndSignCSR(autoIdDigest, keyPair).then((csr) => {
      issueCertificate(csr, {
        keyPair,
      }).then((certificate) => {
        setCertificate(certificate.toString("pem"));
      });
    });
  }, [keypairPem?.data, autoIdDigest]);

  useEffect(() => {
    onIssueCertificate()
  }, [onIssueCertificate])

  const autoId = useMemo(
    () => blake2b(32).update(Buffer.from(autoIdDigest)).digest("hex"),
    [autoIdDigest]
  );

  const onIssueAutoId = useCallback(async () => {
    if (!certificate) return;

    setIssuing(true);
    setIssuingError(null);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auto-id`,
      {
        method: "POST",
        body: JSON.stringify({ certificatePem: certificate }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(handleHttpResponse);

    const data: RegisterAutoIdResponseBody = await response.json();

    if (data.status === "success") {
      const api = await getDomainApi();

      await api.rpc.author.submitAndWatchExtrinsic(
        data.signedExtrinsic,
        async (result) => {
          if (!result.isInBlock) return;
          const { extrinsics } = await api.derive.chain.getBlock(
            result.asInBlock
          );

          const extrinsic = extrinsics.find(
            (ext) => ext.extrinsic.hash.toHex() === data.hash
          );

          if (!extrinsic) {
            setIssuingError({
              status: "unknownError",
              message: "Extrinsic not found",
            });
            return;
          } else if (extrinsic.dispatchError) {
            const { index, error } = extrinsic.dispatchError.asModule;
            const { name } = api.registry.findMetaError({
              index,
              error,
            });
            setIssuingError({
              status: "error",
              errorName: name,
            });
            return;
          } else {
            addAutoId({
              autoId: autoId,
              provider,
              certificatePem: certificate,
              uuid,
              autoIdDigest,
            });
            toast.success("Auto-ID registered successfully");
            window.location.assign("/auto-id");
          }
        }
      );
    }
  }, [certificate, autoId]);

  const certificateHash = useMemo(() => {
    if (!certificate) {
      return null;
    }

    return blake2b(16)
      .update(Buffer.from(certificate))
      .digest("hex")
      .slice(0, 8);
  }, [certificate]);

  return (
    <div className="flex flex-col border border-black rounded md:w-[60%] min-h-[60%] w-9/10 items-center justify-between gap-4 bg-slate-50">
      <div className="w-1/2 flex flex-col gap-4 p-4">
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
            name={`x509 certificate (${certificateHash})`}
            placeholder={"Issuing certificate..."}
            copyMessage="Certificate copied to clipboard"
            downloadFilename={`cert-${certificateHash}.pem`}
          />
        </div>
      </div>
      <div className="p-8 flex flex-col gap-4">
        <button
          onClick={onIssueAutoId}
          className="font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101 text-nowrap"
        >
          {issuing ? "Issuing..." : "Issue Auto-ID"}
        </button>
        {issuingError && (
          <p className="text-center text-red-400">
            {issuingError.status === "error"
              ? `Error registering Auto-ID: ${issuingError.errorName}`
              : `Unknown error registering Auto-ID. If
            this persists, please contact support.`}
          </p>
        )}
      </div>
    </div>
  );
}
