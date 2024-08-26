import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "../../../../utils/getEnv";
import { Client, GatewayIntentBits } from "discord.js";
import { discord } from "../../../../services/auth";
import { addMemberToGuild } from '../../../../services/auth/discord'

interface EnsureServerUserRequestBody { accessToken: string }

export async function POST(req: NextRequest) {
    try {
        const { accessToken } =
            (await req.json()) as EnsureServerUserRequestBody;

        // Verify the user is not already linked
        const botAccessToken = getEnv("DISCORD_BOT_TOKEN");

        // Get user from provider and accessToken and link the user to the autoId
        const user = await discord.getUserFromAccessToken(accessToken);

        const guildId = getEnv("DISCORD_GUILD_ID");

        await addMemberToGuild(
            botAccessToken,
            accessToken,
            guildId,
            user.id
        );


        return NextResponse.json({ success: true, guildId }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal server error, if persists contact administrator" },
            { status: 500 }
        );
    }
}