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

import { getReports } from "@/api/index"
import ThemeSelect from "@/component/theme-select"

export default async function Home() {
	const usersWithReport = await getReports()

	return (
		<>
			<main className="p-12">
				<TabGroup>
					<div className="flex justify-between">
						<TabList variant="solid">
							{usersWithReport.map((user) => (
								<Tab key={user.id} className="items-center">
									{user.name}
								</Tab>
							))}
						</TabList>
						<div className="w-40">
							<ThemeSelect />
						</div>
					</div>
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
																tooltip={row?.netChange}
															>
																{row?.netPercentChangeInDouble.toFixed(2)}
															</BadgeDelta>
														</TableCell>
														<TableCell className="text-right">
															<Badge
																color={getColor(row?.netPercentChangeInDouble)}
															>
																{row?.lastPrice}
															</Badge>
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
