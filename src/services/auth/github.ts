import { getEnv } from "../../utils/getEnv";
import { handleHttpResponse } from "../../utils/http";

export const AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_AUTH_CLIENT_ID}`;

interface GithubAcessTokenResponse {
  access_token: string;
  scope: string;
  token_type: string;
}

interface GithubUser {
  id: string;
}

export const getAccessTokenFromCode = (code: string) => {
  return fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    body: JSON.stringify({
      client_id: getEnv("GITHUB_AUTH_CLIENT_ID"),
      client_secret: getEnv("GITHUB_AUTH_CLIENT_SECRET"),
      code,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
    .then(handleHttpResponse)
    .then((response) => response.json() as Promise<GithubAcessTokenResponse>);
};

export const getUserFromAccessToken = (accessToken: string) => {
  return fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then(handleHttpResponse)
    .then((response) => response.json() as Promise<GithubUser>);
};

export const getUserFromCode = (accessToken: string) => {
  return getAccessTokenFromCode(accessToken).then((response) =>
    getUserFromAccessToken(response.access_token)
  );
};
