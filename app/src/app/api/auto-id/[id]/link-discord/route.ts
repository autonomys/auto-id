import { discord } from "../../../../../services/auth";
import { Client, GatewayIntentBits, Guild } from "discord.js";
import { getDomainApi } from "../../../../../services/autoid/misc";
import { authenticateAutoIdUser } from "@autonomys/auto-id";
import { discordLinkAccessTokenChallenge } from "../../../../../services/autoid/challenges";
import { getEnv } from "../../../../../utils/getEnv";
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

    const promises: [Promise<boolean>, Promise<Guild>] = [
      verifySignature(autoId, accessToken, signature),
      getGuild(client, botAccessToken),
    ];

    const [isCorrectlySigned, guild]: [boolean, Guild] = await Promise.all(
      promises
    );

    if (!isCorrectlySigned) {
      return NextResponse.json(
        { error: "Failed to verify the signature" },
        { status: 401 }
      );
    }

    const role = guild.roles.cache.find(
      (role) => role.name === getEnv("DISCORD_GRANTED_ROLE")
    );

    if (!role) {
      return NextResponse.json(
        { error: "Server error if persists contact administrator" },
        { status: 500 }
      );
    }

    const member = guild.members.cache.find((u) => u.id === user.id);
    if (!member) {
      await guild.members.add(user.id, {
        roles: [role],
        accessToken,
      });
    } else {
      const member = await guild.members.fetch(user.id);
      await member.roles.add(role);
    }

    return NextResponse.json(
      { success: true, guildId: guild.id },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error, if persists contact administrator" },
      { status: 500 }
    );
  }
}

const verifySignature = async (
  autoId: string,
  accessToken: string,
  signature: string
) => {
  const api = await getDomainApi();
  return authenticateAutoIdUser(
    api,
    autoId,
    discordLinkAccessTokenChallenge(accessToken),
    Buffer.from(signature, "hex")
  );
};

const getGuild = async (client: Client, botAccessToken: string) => {
  await client.login(botAccessToken);

  const guildId = getEnv("DISCORD_GUILD_ID");
  const guild = await client.guilds.fetch(guildId);

  return guild;
};
