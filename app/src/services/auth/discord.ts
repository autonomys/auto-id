import qs from "qs";
import { getEnv } from "../../utils/getEnv";
import { authBasicHeader, handleHttpResponse } from "../../utils/http";

export type DiscordState =
  | {
      action: DiscordAction.OAuth;
    }
  | {
      action: DiscordAction.AutoIdVerification;
      autoId: string;
    };

export const encodeDiscordState = (state: DiscordState) => {
  return Buffer.from(JSON.stringify(state)).toString("base64");
};

export const decodeDiscordState = (state: string) => {
  return JSON.parse(Buffer.from(state, "base64").toString()) as DiscordState;
};

export enum DiscordAction {
  OAuth = "oauth",
  AutoIdVerification = "auto-id",
}

export const discordAuthUrl = (state: DiscordState, scope = "identify+email") =>
  `https://discord.com/oauth2/authorize?client_id=${getEnv(
    "DISCORD_AUTH_CLIENT_ID"
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    getEnv("DISCORD_AUTH_REDIRECT_URI")
  )}&scope=${scope}&state=${encodeDiscordState(state)}`;

interface DiscordAcessTokenResponse {
  access_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
}

export const getAccessTokenFromCode = (code: string) => {
  const body = qs.stringify({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: getEnv("DISCORD_AUTH_REDIRECT_URI"),
    client_id: getEnv("DISCORD_AUTH_CLIENT_ID"),
    client_secret: getEnv("DISCORD_AUTH_CLIENT_SECRET"),
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: authBasicHeader(
      getEnv("DISCORD_AUTH_CLIENT_ID"),
      getEnv("DISCORD_AUTH_CLIENT_SECRET")
    ),
  };

  return fetch(`https://discord.com/api/oauth2/token`, {
    headers: headers,
    method: "POST",
    body,
  })
    .then(handleHttpResponse)
    .then((e) => e.json() as Promise<DiscordAcessTokenResponse>)
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const getUserFromAccessToken = (accessToken: string) => {
  return fetch("https://discord.com/api/users/@me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(handleHttpResponse)
    .then((response) => response.json() as Promise<DiscordUser>);
};

export const getUserFromCode = (accessToken: string) => {
  return getAccessTokenFromCode(accessToken).then((response) =>
    getUserFromAccessToken(response.access_token)
  );
};

export const addMemberToGuild = (
  botAccessToken: string,
  userAccessToken: string,
  guildId: string,
  userId: string
) => {
  return fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${botAccessToken}`,
    },
    body: JSON.stringify({
      access_token: userAccessToken,
    }),
  })
    .then(handleHttpResponse)
    .catch((e) => {
      console.log(e);
    });
};
