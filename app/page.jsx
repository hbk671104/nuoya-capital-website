import { auth } from "@/auth"
import { authOptions } from "@/api/auth/[...nextauth]/route"
import { getReport } from "@/api/account"

import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react"

import ReportTable from "@/component/report-table"
import ThemeSelect from "@/component/theme-select"
import LogoutButton from "@/component/logout-button"

// import SymbolSearch from "@/component/symbol-search"

export default async function Home() {
	const session = await auth()
	if (!session) {
		return (
			<div className="p-12 space-y-6">
				<div>Unauthorized. Please log in.</div>
				<LogoutButton />
			</div>
		)
	}

	const profilesWithReport = await Promise.all(
		session.profile.map(async (profile) => {
			const report = await getReport({ session, profile })
			return {
				...profile,
				report,
			}
		}),
	)

	return (
		<div className="p-12 space-y-6">
			<main>
				<TabGroup>
					<div className="flex justify-between items-center">
						<TabList variant="solid">
							{profilesWithReport.map((profile) => (
								<Tab key={profile.hashValue}>{profile.accountNumber}</Tab>
							))}
						</TabList>
						<div>
							<ThemeSelect />
						</div>
					</div>
					<TabPanels className="mt-6">
						{profilesWithReport.map((profile) => (
							<TabPanel key={profile.hashValue}>
								<ReportTable report={profile.report} />
							</TabPanel>
						))}
					</TabPanels>
				</TabGroup>
			</main>
			<LogoutButton />
			<footer className="text-sm text-center text-gray-500">
				Copyright @ {new Date().getFullYear()} Nuoya Capital LLC. All rights
				reserved.
			</footer>
		</div>
	)
}
