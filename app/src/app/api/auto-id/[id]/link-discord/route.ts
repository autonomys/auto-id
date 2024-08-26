import { discord } from "../../../../../services/auth";
import { Client, GatewayIntentBits, Guild } from "discord.js";
import { getDomainApi } from "../../../../../services/autoid/misc";
import { authenticateAutoIdUser } from "@autonomys/auto-id";
import { discordLinkAccessTokenChallenge } from "../../../../../services/autoid/challenges";
import { getEnv } from "../../../../../utils/getEnv";
import { addMemberToGuild } from "../../../../../services/auth/discord";
import { NextRequest, NextResponse } from "next/server";

interface LinkRequestBody {
  accessToken: string;
  signature: string;
  autoId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { autoId, accessToken, signature } =
      (await req.json()) as LinkRequestBody;

    if (typeof autoId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid parameter: autoId" },
        { status: 400 }
      );
    }

    if (typeof accessToken !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid parameter: accessToken" },
        { status: 400 }
      );
    }
    if (typeof signature !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid parameter: signature" },
        { status: 400 }
      );
    }

    // Verify the signature
    const api = await getDomainApi();
    const verificationResult = await authenticateAutoIdUser(
      api,
      autoId,
      discordLinkAccessTokenChallenge(accessToken),
      Buffer.from(signature, "hex")
    );

    if (!verificationResult) {
      return NextResponse.json(
        { error: "Failed to verify the signature" },
        { status: 401 }
      );
    }

    // Verify the user is not already linked
    const botAccessToken = getEnv("DISCORD_BOT_TOKEN");

    // Get user from provider and accessToken and link the user to the autoId
    const user = await discord.getUserFromAccessToken(accessToken);

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Required to manage guild members,
      ],
    });

    await client.login(botAccessToken);

    const guildId = getEnv("DISCORD_GUILD_ID");
    const guild = await client.guilds.fetch(guildId);

    const role = guild.roles.cache.find(
      (role) => role.name === getEnv("DISCORD_GRANTED_ROLE")
    );

    if (!role) {
      return NextResponse.json(
        { error: "Server error if persists contact administrator" },
        { status: 500 }
      );
    }

    const member = await guild.members.fetch(user.id);
    await member.roles.add(role);

    return NextResponse.json({ success: true, guildId }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error, if persists contact administrator" },
      { status: 500 }
    );
  }
}
