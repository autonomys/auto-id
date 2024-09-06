import { RedirectType, redirect } from "next/navigation";
import { github } from "../../../../services/auth";
import { retries } from "../../../../utils/promise";

async function GitHub({
    searchParams: { code },
}: {
    searchParams: { code: string };
}) {
    const user = await retries(() => github.getUserFromCode(code), 3, 500);

    redirect(
        `/auto-id/new?provider=github&uuid=${user.id}`,
        RedirectType.replace
    );
}

export default GitHub;
