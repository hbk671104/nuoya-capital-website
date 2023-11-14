import got from 'got'
const endpoint = 'https://api.tdameritrade.com/v1'
const apikey = process.env.CONSUMER_KEY

export const getBearerToken = async (refresh_token) => {
  const res = await got
    .post(`${endpoint}/oauth2/token`, {
      form: {
        grant_type: 'refresh_token',
        refresh_token,
        client_id: apikey,
      },
    })
    .json()
  return res?.access_token
}

export const getPositions = async ({ id, refresh_token }) => {
  const accessToken = await getBearerToken(refresh_token)
  const res = await got(`${endpoint}/accounts/${id}?fields=positions`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).json()
  return {
    netLiquidation: res?.securitiesAccount?.currentBalances?.liquidationValue,
    positions: res?.securitiesAccount?.positions,
  }
}

export const getQuotes = async ({ symbol }) => {
  const res = await got(
    `${endpoint}/marketdata/quotes?apikey=${apikey}&symbol=${symbol}`
  ).json()
  return res
}

export const generateReport = async (account) => {
  const { netLiquidation, positions } = await getPositions(account)
  const raw = positions.reduce((acc, position) => {
    const { instrument, shortQuantity, longQuantity } = position
    let short, long, sym
    switch (instrument.assetType) {
      case 'EQUITY':
        const { symbol } = instrument
        short = shortQuantity / 100
        long = longQuantity / 100
        sym = symbol
        break
      case 'OPTION':
        const { underlyingSymbol, putCall } = instrument
        short = putCall === 'CALL' ? shortQuantity : longQuantity
        long = putCall === 'CALL' ? longQuantity : shortQuantity
        sym = underlyingSymbol
        break
      default:
        return acc
    }
    return {
      ...acc,
      [sym]: {
        long: acc[sym] ? acc[sym].long + long : long,
        short: acc[sym] ? acc[sym].short + short : short,
      },
    }
  }, {})
  const quotes = await getQuotes({ symbol: Object.keys(raw).join(',') })
  const report = Object.keys(raw)
    .sort((a, b) => a.localeCompare(b))
    .map((key) => {
      const { lastPrice } = quotes[key]
      const delta = (netLiquidation * 0.17) / lastPrice
      const gamma = delta / (lastPrice * 0.05)
      return {
        symbol: key,
        short: raw[key].short,
        long: raw[key].long,
        lastPrice,
        delta: delta.toFixed(2),
        gamma: gamma.toFixed(2),
      }
    })
  return report
}
