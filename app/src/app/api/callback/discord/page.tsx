import { RedirectType, notFound, redirect } from "next/navigation";
import { discord } from "../../../../services/auth";
import { decodeDiscordState, DiscordAction, DiscordState } from "../../../../services/auth/discord";
import { retries } from "../../../../utils/promise";

async function Discord({
    searchParams: { code, state },
}: {
    searchParams: { code: string, state: string };
}) {
    const discordState: DiscordState = decodeDiscordState(state);

    switch (discordState.action) {
        case DiscordAction.AutoIdVerification:
            const { access_token } = await retries(() => discord.getAccessTokenFromCode(code), 3, 500);
            redirect(
                `/auto-id/${discordState.autoId}/link?provider=discord&access_token=${access_token}`,
                RedirectType.replace
            );
        case DiscordAction.OAuth:
            const user = await retries(() => discord.getUserFromCode(code), 3, 500);
            redirect(
                `/auto-id/new?provider=discord&uuid=${user.id}`,
                RedirectType.replace
            )
        default:
            notFound();
    }
}

export default Discord;
