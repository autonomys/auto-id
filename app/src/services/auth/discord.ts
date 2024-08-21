import qs from "qs";
import axios from "axios";
import { getEnv } from "../../utils/getEnv";

export const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${getEnv(
  "DISCORD_AUTH_CLIENT_ID"
)}&response_type=code&redirect_uri=${encodeURIComponent(
  getEnv("DISCORD_AUTH_REDIRECT_URI")
)}&scope=identify+email`;

interface DiscordAcessTokenResponse {
  access_token: string;
  scope: string;
}

interface DiscordUser {
  id: string;
}

export const getAccessTokenFromCode = (code: string) => {
  const data = qs.stringify({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: getEnv("DISCORD_AUTH_REDIRECT_URI"),
    client_id: getEnv("DISCORD_AUTH_CLIENT_ID"),
    client_secret: getEnv("DISCORD_AUTH_CLIENT_SECRET"),
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return axios
    .post(`https://discord.com/api/oauth2/token`, data, {
      headers: headers,
      auth: {
        username: getEnv("DISCORD_AUTH_CLIENT_ID"),
        password: getEnv("DISCORD_AUTH_CLIENT_SECRET"),
      },
    })
    .then((response) => response.data as DiscordAcessTokenResponse)
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const getUserFromAccessToken = (accessToken: string) => {
  console.log("accessToken", accessToken);

  return fetch("https://discord.com/api/users/@me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((response) => response.json() as Promise<DiscordUser>)
    .then((user) => {
      console.log(user);
      return user;
    });
};

export const getUserFromCode = (accessToken: string) => {
  return getAccessTokenFromCode(accessToken).then((response) =>
    getUserFromAccessToken(response.access_token)
  );
};
