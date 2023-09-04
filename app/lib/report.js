import got from 'got'

export const getBearerToken = async (refresh_token) => {
  try {
    const { access_token } = await got
      .post('https://api.tdameritrade.com/v1/oauth2/token', {
        form: {
          grant_type: 'refresh_token',
          refresh_token,
          client_id: process.env.CONSUMER_KEY,
        },
      })
      .json()
    return Promise.resolve(access_token)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getAccount = async ({ id, refresh_token }) => {
  try {
    const accessToken = await getBearerToken(refresh_token)
    const account = await got(
      `https://api.tdameritrade.com/v1/accounts/${id}?fields=positions,orders`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).json()
    return Promise.resolve(account)
  } catch (error) {
    return Promise.reject(error)
  }
}

export const generateReport = async (account) => {
  try {
    const { securitiesAccount } = await getAccount(account)
    const raw = securitiesAccount?.positions.reduce((acc, position) => {
      const { instrument, shortQuantity, longQuantity } = position
      switch (instrument.assetType) {
        case 'EQUITY': {
          const { symbol } = instrument
          const short = shortQuantity / 100
          const long = longQuantity / 100
          return {
            ...acc,
            [symbol]: {
              long: acc[symbol] ? acc[symbol].long + long : long,
              short: acc[symbol] ? acc[symbol].short + short : short,
            },
          }
        }
        case 'OPTION': {
          const { underlyingSymbol, putCall } = instrument
          const short = putCall === 'CALL' ? shortQuantity : longQuantity
          const long = putCall === 'CALL' ? longQuantity : shortQuantity
          return {
            ...acc,
            [underlyingSymbol]: {
              long: acc[underlyingSymbol]
                ? acc[underlyingSymbol].long + long
                : long,
              short: acc[underlyingSymbol]
                ? acc[underlyingSymbol].short + short
                : short,
            },
          }
        }
        default:
          return acc
      }
    }, {})
    const report = Object.keys(raw)
      .sort((a, b) => a.localeCompare(b))
      .map((key) => ({
        symbol: key,
        short: raw[key].short,
        long: raw[key].long,
      }))
    return Promise.resolve(report)
  } catch (error) {
    return Promise.reject(error)
  }
}
