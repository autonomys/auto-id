import { randomAsHex } from "@polkadot/util-crypto";
import { redirect, RedirectType } from "next/navigation";

export default function NewAutoId() {
  redirect(
    `/auto-id/new?provider=raw&uuid=${randomAsHex(32)}`,
    RedirectType.replace
  );
}
