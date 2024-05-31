"use client"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Card,
	Badge,
	BadgeDelta,
} from "@tremor/react"

export default function ReportTable({ report }) {
	return (
		<Card decoration="top" decorationColor="indigo">
			<Table>
				<TableHead>
					<TableRow>
						<TableHeaderCell>Symbol</TableHeaderCell>
						<TableHeaderCell className="text-right">Short(s)</TableHeaderCell>
						<TableHeaderCell className="text-right">Long(s)</TableHeaderCell>
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
					{report.map((row) => {
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
	)
}
