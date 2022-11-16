import Head from 'next/head'
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    IconButton,
    useColorMode,
} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

import { generateReport } from '../lib/report'
import { nuoya, wei } from '../lib/account'
import DataDisplay from '../components/data-display'

export async function getServerSideProps(context) {
    let users = [nuoya, wei]
    const reports = await Promise.all(users.map((u) => generateReport(u)))
    users = users.map((u, i) => ({ ...u, report: reports[i] }))

    return {
        props: {
            // props for your component
            users,
        },
    }
}

export default function Home({ users }) {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <>
            <Head>
                <title>Nuoya Capital</title>
                <meta name="description" content="nuoya.capital" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen flex flex-col p-6">
                <Tabs align="center" variant="solid-rounded" defaultIndex={0}>
                    <TabList>
                        {users.map((u) => (
                            <Tab key={u.name}>{u.name}</Tab>
                        ))}
                    </TabList>
                    <TabPanels className="max-w-lg">
                        {users.map((u, index) => (
                            <TabPanel key={`${index}`}>
                                <DataDisplay report={u?.report} />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
                <div className="flex flex-row justify-end">
                    <IconButton
                        icon={
                            colorMode === 'light' ? <MoonIcon /> : <SunIcon />
                        }
                        onClick={toggleColorMode}
                    />
                </div>
            </main>
        </>
    )
}
