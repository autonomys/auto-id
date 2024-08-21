import { AES, enc } from "crypto-js";
import { useCallback, useState } from "react";
import { useLocalStorage, useSessionStorage } from "usehooks-ts";
import { EncryptedPrivateKey, HexPrivateKey } from "@/types/keyring";
import { cryptoKeyToPem, keyToHex, pemToPrivateKey } from "@autonomys/auto-id";

export const LogIn = () => {
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [encryptedKeypair] = useLocalStorage<EncryptedPrivateKey | null>(
    "encrypted-keypair",
    null
  );
  const [_, setKeypair] = useSessionStorage<HexPrivateKey | null>(
    "keypair",
    null
  );

  const onUnlock = useCallback(async () => {
    if (!encryptedKeypair) {
      throw new Error("No encrypted keypair found");
    }

    try {
      const keypair = await pemToPrivateKey(
        encryptedKeypair.data,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        password
      );

      const privateKey = await cryptoKeyToPem(keypair);

      setKeypair({ data: privateKey });
    } catch (error) {
      console.error(error);
      setPasswordError(true);
    }
  }, [encryptedKeypair, password, setKeypair]);

  return (
    <div className="flex flex-col border border-black rounded p-4 md:w-[40%] min-h-[40%] w-9/10 justify-around items-center gap-4 bg-slate-50">
      <h2 className="text-3xl">Auto-ID</h2>
      <p className="text-blue text-center text-slate-500">
        Use your password to access your auto-id.
      </p>
      <input
        type="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-black rounded p-2 h-8 w-3/5"
      />
      <button
        onClick={onUnlock}
        className={`font-semibold text-white bg-primary py-2 px-16 rounded-md text-xl hover:opacity-80 hover:scale-101`}
      >
        Unlock
      </button>
      {passwordError && (
        <p className="text-center text-red-400">{"Incorrect password"}</p>
      )}
    </div>
  );
};
