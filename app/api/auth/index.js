import got from "got"

export const getRefreshToken = ({ provider, params }) => {
  return got.post(provider.token.url, {
    form: {
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: provider.callbackUrl,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${provider.clientId}:${provider.clientSecret}`
      ).toString("base64")}`,
    },
  }).json()
}