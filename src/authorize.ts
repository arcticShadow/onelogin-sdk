import got from "got";
import { handleErrors } from "./client.js";

let token: TokenEndpointResponse & { expiryDate: Date };

type TokenEndpointResponse = {
  access_token: string;
  created_at: string;
  expires_in: number;
  refresh_token: string;
  token_type: "bearer";
  account_id: number;
};

const getToken = async (): Promise<TokenEndpointResponse> =>
  await got("auth/oauth2/v2/token", {
    prefixUrl: "https://ecomi.onelogin.com/",
    method: "POST",
    headers: {
      authorization: `client_id:${process.env.OL_CLIENT_ID}, client_secret:${process.env.OL_CLIENT_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
    }),
  }).json();

const getAuthorization = async () => {
  // if token, and Not expired, use that one.
  if (token && new Date() < token.expiryDate) {
    console.info("Using existing Token");
  }

  // if token, and is expired, refresh it
  if (token && new Date() > token.expiryDate) {
    console.info("Token Expired - Refreshing Token");
  }

  // if no token, then get new token
  if (!token) {
    console.info("Getting new token");
    try {
      const _token = await getToken();

      token = {
        ..._token,
        expiryDate: new Date(Date.now() + _token.expires_in),
      };
    } catch (e: unknown) {
      handleErrors(e);
    }
  }

  return token;
};

export { getAuthorization };
