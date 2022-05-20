import Head from 'next/head'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import { generateReport } from '../lib/report'
import { nuoya, wei } from '../lib/account'
import DataDisplay from '../components/data-display'

export async function getServerSideProps(context) {
    const reports = await Promise.all([
        generateReport(nuoya),
        generateReport(wei),
    ])
    return {
        props: {
            // props for your component
            reports,
        },
    }
}

export default function Home({ reports }) {
    return (
        <>
            <Head>
                <title>Nuoya Capital</title>
                <meta name="description" content="nuoya.capital" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="min-h-screen flex flex-col py-6">
                <Tabs align="center" variant="solid-rounded" defaultIndex={0}>
                    <TabList>
                        <Tab>Nuoya</Tab>
                        <Tab>Wei</Tab>
                    </TabList>
                    <TabPanels>
                        {reports?.map((report, index) => (
                            <TabPanel key={`${index}`} className="max-w-lg">
                                <DataDisplay report={report} />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
            </main>
        </>
    )
}
