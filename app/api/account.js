import got from "got"
import { getQuotes } from "@/api/market";

const options = {
  prefixUrl: 'https://api.schwabapi.com/trader/v1',
};

const client = got.extend(options)

export const getUserInfo = async ({ accessToken }) => {
  const [preference, accountNumbers] = await Promise.all([
    client.get('userPreference', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).json(),
    client.get('accounts/accountNumbers', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).json(),
  ])

  const mainAccount = preference.accounts[0]
  const hashValue = accountNumbers[0].hashValue

  return {
    ...mainAccount,
    hashValue,
  }
}

const getPositions = async ({ session }) => {
  const accessToken = session.account?.access_token
  const accountNumber = session.profile?.hashValue

  const res = await client.get(`accounts/${accountNumber}`, {
    searchParams: {
      fields: "positions",
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).json()

  return {
    netLiquidation: res?.securitiesAccount?.currentBalances?.liquidationValue,
    positions: res?.securitiesAccount?.positions,
  }
}

export const getReport = async ({ session }) => {
  const { netLiquidation, positions } = await getPositions({
    session
  })

  // get the raw data first
  const raw = positions.reduce((acc, position) => {
    const { instrument, shortQuantity, longQuantity } = position
    let short
    let long
    let sym
    switch (instrument.assetType) {
      case "COLLECTIVE_INVESTMENT":
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
  const quotes = await getQuotes({ session, symbols: Object.keys(raw).join(",") })

  const report = Object.keys(raw)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const { quote } = quotes[key]
      const { lastPrice, netPercentChange, netChange } = quote
      const delta = netLiquidation / 6.0 / lastPrice
      const gamma = delta / (lastPrice * 0.05)

      return {
        symbol: key,
        short: raw[key].short,
        long: raw[key].long,
        lastPrice,
        netPercentChange,
        netChange,
        delta: delta.toFixed(2),
        gamma: gamma.toFixed(2),
      }
    })

  return report
}
