import { notFound } from 'next/navigation';
import { AutoIdDetails } from '../../../components/AutoIdDetails/AutoIdDetails';
import { DiscordAction, discordAuthUrl } from '../../../services/auth/discord';


export default function AutoId({ params }: { params: { id: string } }) {
    const { id } = params;
    if (!id) {
        notFound()
    }

    const linkToDiscordUrl = discordAuthUrl({
        action: DiscordAction.AutoIdVerification,
        autoId: id,
    }, 'identify+email+guilds.join')

    return <AutoIdDetails linkToDiscordUrl={linkToDiscordUrl} autoId={id}></AutoIdDetails>
}