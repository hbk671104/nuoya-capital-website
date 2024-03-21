import got from 'got';
import dayjs from 'dayjs';

const ENDPOINT = "https://api.tdameritrade.com/v1"
const API_KEY = process.env.CONSUMER_KEY

import { getUsers, updateAccessToken, updateRefreshToken } from '@/prisma';

const getTokenInfo = async (refreshToken, extraConfig = {}) => {
  const data = await got
    .post(`${ENDPOINT}/oauth2/token`, {
      form: {
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: API_KEY,
        ...extraConfig
      },
    })
    .json()

  return data
}

const getPositions = async ({ id, accessToken }) => {
  const res = await got(`${ENDPOINT}/accounts/${id}?fields=positions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).json()

  return {
    netLiquidation: res?.securitiesAccount?.currentBalances?.liquidationValue,
    positions: res?.securitiesAccount?.positions,
  }
}

const getQuotes = async ({ symbol }) => {
  const res = await got(
    `${ENDPOINT}/marketdata/quotes?apikey=${API_KEY}&symbol=${symbol}`,
  ).json()

  console.log(res)
  return res
}

const getBearerToken = async (user) => {
  let expiresAt = dayjs(user.refreshTokenExpiresAt)

  // If refresh token is expired within one month, request a new one
  if (expiresAt.isBefore(dayjs().add(1, 'M'))) {
    const data = await getTokenInfo(user.refreshToken, { access_type: "offline" })

    // update refresh token and access token
    await updateRefreshToken(user.id, { refreshToken: data?.refresh_token, refreshTokenExpiresAt: dayjs().add(data?.refresh_token_expires_in, 's').toDate() })
    const updatedUser = await updateAccessToken(user.id, { accessToken: data?.access_token, accessTokenExpiresAt: dayjs().add(data?.expires_in, 's').toDate() })

    return updatedUser.accessToken
  }

  expiresAt = dayjs(user.accessTokenExpiresAt)

  // if access token doesn't exist or if access token is expired within five minutes, request a new one
  if (!user.accessToken || expiresAt.isBefore(dayjs().add(5, 'm'))) {
    const data = await getTokenInfo(user.refreshToken)

    // update access token only
    const updatedUser = await updateAccessToken(user.id, { accessToken: data?.access_token, accessTokenExpiresAt: dayjs().add(data?.expires_in, 's').toDate() })

    return updatedUser.accessToken
  }

  // access token is valid
  return user?.accessToken
}

export const getReports = async () => {
  const users = await getUsers()
  const reports = await Promise.all(users.map(async (user) => {
    const accessToken = await getBearerToken(user)
    const { netLiquidation, positions } = await getPositions({ id: user.id, accessToken })

    // get the raw data first
    const raw = positions.reduce((acc, position) => {
      const { instrument, shortQuantity, longQuantity } = position
      let short
      let long
      let sym
      switch (instrument.assetType) {
        case "EQUITY": {
          const { symbol } = instrument
          short = shortQuantity / 100
          long = longQuantity / 100
          sym = symbol
          break
        }
        case "OPTION": {
          const { underlyingSymbol, putCall } = instrument
          short = putCall === "CALL" ? shortQuantity : longQuantity
          long = putCall === "CALL" ? longQuantity : shortQuantity
          sym = underlyingSymbol
          break
        }
        default:
          return acc
      }

      acc[sym] = {
        long: acc[sym] ? acc[sym].long + long : long,
        short: acc[sym] ? acc[sym].short + short : short,
      }

      return acc
    }, {})

    // get quotes
    const quotes = await getQuotes({ symbol: Object.keys(raw).join(",") })
    const report = Object.keys(raw)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => {
        const { lastPrice, netPercentChangeInDouble, netChange } = quotes[key]
        const delta = netLiquidation / 6.0 / lastPrice
        const gamma = delta / (lastPrice * 0.05)

        return {
          symbol: key,
          short: raw[key].short,
          long: raw[key].long,
          lastPrice,
          netPercentChangeInDouble,
          netChange,
          delta: delta.toFixed(2),
          gamma: gamma.toFixed(2),
        }
      })

    return {
      ...user,
      report,
    }
  }))

  return reports
}