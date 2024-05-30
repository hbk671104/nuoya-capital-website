import { getServerSession } from "next-auth/next"
import { authOptions } from "@/api/auth/[...nextauth]/route"
import { getReport } from "@/api/account"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Card,
	Divider,
	Badge,
	BadgeDelta,
} from "@tremor/react"

import ThemeSelect from "@/component/theme-select"
import LogoutButton from "@/component/logout-button"

// import SymbolSearch from "@/component/symbol-search"

export default async function Home() {
	const session = await getServerSession(authOptions)
	if (!session) {
		return (
			<div className="p-12 space-y-6">
				<div>Unauthorized. Please log in.</div>
				<LogoutButton />
			</div>
		)
	}

	const report = await getReport({ session })
	return (
		<div className="p-12 space-y-6">
			<header className="flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<div className="font-semibold">{session.profile?.accountNumber}</div>
					<Badge>{session.profile?.type}</Badge>
				</div>
				<div>
					<ThemeSelect />
				</div>
			</header>
			<Divider />
			<main>
				<Card decoration="top" decorationColor="indigo">
					<Table>
						<TableHead>
							<TableRow>
								<TableHeaderCell>Symbol</TableHeaderCell>
								<TableHeaderCell className="text-right">
									Short(s)
								</TableHeaderCell>
								<TableHeaderCell className="text-right">
									Long(s)
								</TableHeaderCell>
								<TableHeaderCell className="text-right">Delta</TableHeaderCell>
								<TableHeaderCell className="text-right">Gamma</TableHeaderCell>
								<TableHeaderCell className="text-right">
									Net Change %
								</TableHeaderCell>
								<TableHeaderCell className="text-right">
									Last Price $
								</TableHeaderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{report?.map((row) => {
								const getDeltaType = (percentage) => {
									if (percentage > 5) {
										return "increase"
									}

									if (percentage > 0 && percentage <= 5) {
										return "moderateIncrease"
									}

									if (percentage === 0) {
										return "unchanged"
									}

									if (percentage < 0 && percentage >= -5) {
										return "moderateDecrease"
									}

									if (percentage < -5) {
										return "decrease"
									}
								}

								const getColor = (percentage) => {
									if (percentage > 0) {
										return "emerald"
									}

									if (percentage === 0) {
										return "orange"
									}

									if (percentage < 0) {
										return "red"
									}
								}

								return (
									<TableRow key={row?.symbol}>
										<TableCell>
											<Badge>{row?.symbol}</Badge>
										</TableCell>
										<TableCell className="text-right text-red-500">
											{row?.short}
										</TableCell>
										<TableCell className="text-right text-emerald-500">
											{row?.long}
										</TableCell>
										<TableCell className="text-right">{row?.delta}</TableCell>
										<TableCell className="text-right">{row?.gamma}</TableCell>
										<TableCell className="text-right">
											<BadgeDelta
												deltaType={getDeltaType(row?.netPercentChange)}
												tooltip={row?.netChange}
											>
												{row?.netPercentChange.toFixed(2)}
											</BadgeDelta>
										</TableCell>
										<TableCell className="text-right">
											<Badge color={getColor(row?.netPercentChange)}>
												{row?.lastPrice}
											</Badge>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</Card>
			</main>
			<LogoutButton />
			<footer className="text-sm text-center text-gray-500">
				Copyright @ {new Date().getFullYear()} Nuoya Capital LLC. All rights
				reserved.
			</footer>
		</div>
	)
}
