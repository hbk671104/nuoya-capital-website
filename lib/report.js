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

export const getPositions = async ({ id, refresh_token }) => {
    try {
        const accessToken = await getBearerToken(refresh_token)
        const {
            securitiesAccount: { positions },
        } = await got(
            `https://api.tdameritrade.com/v1/accounts/${id}?fields=positions`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        ).json()
        return Promise.resolve(positions)
    } catch (error) {
        return Promise.reject(error)
    }
}

export const generateReport = async (account) => {
    try {
        const positions = await getPositions(account)
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
