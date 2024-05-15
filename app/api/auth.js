import got from "got"
import dayjs from "dayjs"
import { redirect } from "next/navigation"

import { getUser, setUser, setRefreshToken, setAccessToken } from "@/store"

const ENDPOINT = "https://api.schwabapi.com"
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://nuoya.capital"
    : "https://localhost:3000"

const getTokenInfo = async (
  { code, refreshToken },
  type = "authorization_code",
) => {
  const data = await got
    .post(`${ENDPOINT}/v1/oauth/token`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${API_KEY}:${API_SECRET}`,
        ).toString("base64")}`,
      },
      form: {
        grant_type: type,
        ...(type === "authorization_code"
          ? { code, redirect_uri: REDIRECT_URI }
          : { refresh_token: refreshToken }),
      },
    })
    .json()

  return data
}

export const getBearerToken = async () => {
  const user = getUser()
  if (!user) {
    return null // user need to authenticate
  }

  let expiresAt = dayjs(user.refreshTokenExpiresAt)

  // If refresh token is expired within 1 week, request a new one
  if (expiresAt.isBefore(dayjs().add(1, "w"))) {
    return null // user should re-authenticate
  }

  expiresAt = dayjs(user.accessTokenExpiresAt)

  // if access token doesn't exist or will be expired within 30 minutes, request a new one
  if (!expiresAt || expiresAt.isBefore(dayjs().add(30, "m"))) {
    const data = await getTokenInfo(
      { refreshToken: user.refreshToken },
      "refresh_token",
    )

    // update access token only
    setAccessToken({
      accessToken: data?.access_token,
      accessTokenExpiresAt: dayjs().add(data?.expires_in, "s").toDate(),
    })

    return data?.access_token
  }

  // access token is valid
  return user.accessToken
}

export const checkLogin = async () => {
  const accessToken = await getBearerToken()
  if (!accessToken) {
    startLogin()
  }
}

const startLogin = () => {
  redirect(`${ENDPOINT}/v1/oauth/authorize?client_id=${API_KEY}&response_type=code&redirect_uri=${REDIRECT_URI}`)
}

export const finishLogin = async ({ code }) => {
  const data = await getTokenInfo({ code })
  setRefreshToken({ refreshToken: data.refresh_token, refreshTokenExpiresAt: dayjs().add(1, "w").toDate() })
}

export const logout = () => {
  setUser(undefined)
}