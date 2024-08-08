import { RedirectType, redirect } from "next/navigation";
import { github } from "../../../../services/auth";

async function GitHub({
  searchParams: { code },
}: {
  searchParams: { code: string };
}) {
  const user = await github.getUserFromCode(code);

  redirect(
    `/auto-id/new?provider=github&uuid=${user.id}`,
    RedirectType.replace
  );
}

export default GitHub;
