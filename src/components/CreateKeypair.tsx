import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { EncryptedPrivateKey, HexPrivateKey } from "@/types/keyring";
import { useCallback, useState } from "react";
import { cryptoKeyToPem, generateRsaKeyPair } from "@autonomys/auto-id";

export const CreateKeypair = () => {
  const [, setEncryptedKeypair] = useLocalStorage<EncryptedPrivateKey | null>(
    "encrypted-keypair",
    null
  );
  const [, setKeypair] = useSessionStorage<HexPrivateKey | null>(
    "keypair",
    null
  );

  const [password, setPassword] = useState<string>("");

  const onCreateKeypair = useCallback(async () => {
    const keypair = await generateRsaKeyPair(2048);
    const encryptedKeypair = await cryptoKeyToPem(keypair.privateKey, password);
    const keypairPem = await cryptoKeyToPem(keypair.privateKey);

    setKeypair({ data: keypairPem });
    setEncryptedKeypair({ data: encryptedKeypair });
  }, [password, setEncryptedKeypair, setKeypair]);

  return (
    <div className="flex flex-col ring-1 ring-black ring-opacity-10 rounded p-4 md:w-[40%] min-h-[40%] w-9/10 justify-around items-center gap-4 bg-white">
      <h2 className="text-3xl">Auto-ID</h2>
      <p className="text-blue text-center text-slate-500">
        Create a password to encrypt your randomly generated keypair.
      </p>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="ring-1 ring-black ring-opacity-10 rounded p-2 h-8"
      />
      <button
        onClick={onCreateKeypair}
        className={`font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101`}
      >
        Create keypair
      </button>
    </div>
  );
};
