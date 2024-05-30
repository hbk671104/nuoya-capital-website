import got from "got"

export const getRefreshToken = ({ provider, params }) =>
  got.post("https://api.schwabapi.com/v1/oauth/token", {
    form: {
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: provider.callbackUrl,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SCHWAB_KEY}:${process.env.SCHWAB_SECRET}`
      ).toString("base64")}`,
    },
  }).json()

export const getAccessToken = ({ account }) =>
  got.post("https://api.schwabapi.com/v1/oauth/token", {
    form: {
      grant_type: "refresh_token",
      refresh_token: account.refresh_token,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SCHWAB_KEY}:${process.env.SCHWAB_SECRET}`
      ).toString("base64")}`,
    },
  }).json()