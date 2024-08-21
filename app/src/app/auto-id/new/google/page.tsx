import { RedirectType, redirect } from "next/navigation";
import { getUserProfile } from "../../../../services/auth/google";

async function Google({
  searchParams: { access_token },
}: {
  searchParams: { access_token: string };
}) {
  const user = await getUserProfile(access_token);

  redirect(
    `/auto-id/new?provider=google&uuid=${user.id}`,
    RedirectType.replace
  );
}

export default Google;
