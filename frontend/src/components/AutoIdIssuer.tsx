"use client";
import { useCallback, useMemo, useState } from "react";
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
import { Crypto } from "@peculiar/webcrypto";
import blake2b from "blake2b";

const crypto = new Crypto();

export interface AutoIdIssuerProps {
  autoId: string;
}

export default function AutoIdIssuer({ autoId }: AutoIdIssuerProps) {
  const [certificate, setCertificate] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<boolean>(false);

  const [keypairPem] = useSessionStorage<HexPrivateKey | null>("keypair", null);

  const onIssueCertificate = useCallback(async () => {
    if (!keypairPem?.data) {
      throw new Error("No keypair found");
    }
    const algorithm = {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    };

    const privateKey = await pemToPrivateKey(keypairPem.data, algorithm);

    const keypair = await cryptoKeyPairFromPrivateKey(privateKey, algorithm);

    const pubkey = await window.crypto.subtle.exportKey(
      "spki",
      keypair.publicKey
    );
    const nativePubKey = await window.crypto.subtle.importKey(
      "spki",
      pubkey,
      algorithm,
      true,
      ["verify"]
    );

    createAndSignCSR(autoId, keypair).then((csr) => {
      issueCertificate(csr, {
        keyPair: { privateKey, publicKey: nativePubKey },
      }).then((certificate) => {
        console.log(certificate.toString());
        setCertificate(certificate.toString("pem"));
      });
    });
  }, [keypairPem]);

  const onIssueAutoId = useCallback(() => {
    setIssuing(true);

    // To-do: issue the Auto-ID
    setTimeout(() => {
      setIssuing(false);
      window.location.assign("/auto-id");
    }, 2000);
  }, []);

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
            name={`x509 certificate (${certificateHash})`}
            placeholder={"No certificate"}
            copyMessage="Certificate copied to clipboard"
            downloadFilename={`cert-${certificateHash}.pem`}
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
