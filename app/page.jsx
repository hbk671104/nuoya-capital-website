import {
	Tab,
	TabGroup,
	TabList,
	TabPanel,
	TabPanels,
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

import { getReports } from "@/api"

export default async function Home() {
	const usersWithReport = await getReports()

	return (
		<>
			<main className="p-12">
				<TabGroup>
					<TabList variant="solid">
						{usersWithReport.map((user) => (
							<Tab key={user.id} className="text-base">
								{user.name}
							</Tab>
						))}
					</TabList>
					<Divider>Portfolio</Divider>
					<TabPanels>
						{usersWithReport.map((user) => (
							<TabPanel key={user.id}>
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
												<TableHeaderCell className="text-right">
													Delta
												</TableHeaderCell>
												<TableHeaderCell className="text-right">
													Gamma
												</TableHeaderCell>
												<TableHeaderCell className="text-right">
													Net Change %
												</TableHeaderCell>
												<TableHeaderCell className="text-right">
													Last Price $
												</TableHeaderCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{user.report?.map((row) => {
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

												return (
													<TableRow key={row?.symbol}>
														<TableCell>
															<Badge>{row?.symbol}</Badge>
														</TableCell>
														<TableCell className="text-right">
															<Badge color="red">{row?.short}</Badge>
														</TableCell>
														<TableCell className="text-right">
															<Badge color="emerald">{row?.long}</Badge>
														</TableCell>
														<TableCell className="text-right">
															{row?.delta}
														</TableCell>
														<TableCell className="text-right">
															{row?.gamma}
														</TableCell>
														<TableCell className="text-right">
															<BadgeDelta
																deltaType={getDeltaType(
																	row?.netPercentChangeInDouble,
																)}
															>
																{row?.netPercentChangeInDouble.toFixed(2)}
															</BadgeDelta>
														</TableCell>
														<TableCell className="text-right">
															{row?.lastPrice}
														</TableCell>
													</TableRow>
												)
											})}
										</TableBody>
									</Table>
								</Card>
							</TabPanel>
						))}
					</TabPanels>
				</TabGroup>
			</main>
			<footer className="text-sm text-center text-gray-500 pb-12">
				Copyright @ {new Date().getFullYear()} Nuoya Capital LLC. All rights
				reserved.
			</footer>
		</>
	)
}
