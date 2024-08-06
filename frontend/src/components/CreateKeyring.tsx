import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { EncryptedKeypair, SerializableKeypair } from "@/types/keyring";
import { useCallback, useState } from "react";
import { ed25519PairFromSeed } from "@polkadot/util-crypto";
import { AES } from "crypto-js";
import { randomBytes } from "crypto";
import { u8aToHex } from "@autonomys/auto-utils";

export const CreateKeyring = () => {
  const [, setEncryptedKeyring] = useLocalStorage<EncryptedKeypair | null>(
    "encrypted-keyring",
    null
  );
  const [, setKeypair] = useSessionStorage<SerializableKeypair | null>(
    "keyring",
    null
  );

  const [password, setPassword] = useState<string>("");

  const onCreateKeyring = useCallback(async () => {
    const keypair = ed25519PairFromSeed(randomBytes(32));
    const storableKeypair: SerializableKeypair = {
      hexPublicKey: u8aToHex(keypair.publicKey),
      hexSecretKey: u8aToHex(keypair.publicKey),
    };

    const encryptedKeypair = AES.encrypt(
      JSON.stringify(storableKeypair),
      password
    ).toString();

    setEncryptedKeyring({ data: encryptedKeypair });
    setKeypair(storableKeypair);
  }, [password, setEncryptedKeyring, setKeypair]);

  return (
    <div className="flex flex-col border border-black rounded p-4 md:w-[40%] min-h-[40%] w-9/10 justify-around items-center gap-4 bg-slate-50">
      <h2 className="text-3xl">Auto-ID</h2>
      <p className="text-blue text-center text-slate-500">
        Create a password to encrypt your randomly generated keyring.
      </p>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-black rounded p-2 h-8"
      />
      <button
        onClick={onCreateKeyring}
        className={`font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101`}
      >
        Create keyring
      </button>
    </div>
  );
};
