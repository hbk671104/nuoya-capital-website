import got from "got"
import { headers } from "next/headers";

const options = {
  prefixUrl: 'https://api.schwabapi.com/v1',
  headers: {
    Authorization: `Basic ${Buffer.from(
      `${process.env.SCHWAB_KEY}:${process.env.SCHWAB_SECRET}`
    ).toString("base64")}`
  }
};

const client = got.extend(options)

export const getRefreshToken = ({ provider, params }) =>
  client.post("oauth/token", {
    form: {
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: provider.callbackUrl,
    },
  }).json()

export const getAccessToken = ({ account }) =>
  client.post("oauth/token", {
    form: {
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    },
  }).json()

