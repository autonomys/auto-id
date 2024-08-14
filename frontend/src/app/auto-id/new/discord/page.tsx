import { RedirectType, redirect } from "next/navigation";
import { discord, github } from "../../../../services/auth";

async function Discord({
  searchParams: { code },
}: {
  searchParams: { code: string };
}) {
  const user = await discord.getUserFromCode(code);

  redirect(
    `/auto-id/new?provider=discord&uuid=${user.id}`,
    RedirectType.replace
  );
}

export default Discord;
