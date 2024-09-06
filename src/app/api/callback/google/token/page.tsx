import { RedirectType, redirect } from "next/navigation";
import { getUserProfile } from "../../../../../services/auth/google"
import { retries } from "../../../../../utils/promise";

async function Google({
    searchParams: { access_token },
}: {
    searchParams: { access_token: string };
}) {
    const user = await retries(() => getUserProfile(access_token), 3, 500);

    redirect(
        `/auto-id/new?provider=google&uuid=${user.id}`,
        RedirectType.replace
    );
}

export default Google;
