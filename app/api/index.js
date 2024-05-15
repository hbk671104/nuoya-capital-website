import got from "got"

const ENDPOINT = "https://api.schwabapi.com"
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

import { getBearerToken } from "@/api/auth"

const getPositions = async ({ id }) => {
	const accessToken = getBearerToken()
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
	return res
}

export const getReports = async () => {
	const users = await getUsers()
	const reports = await Promise.all(
		users.map(async (user) => {
			const accessToken = await getBearerToken(user)
			const { netLiquidation, positions } = await getPositions({
				id: user.id,
				accessToken,
			})

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
		}),
	)

	return reports
}
