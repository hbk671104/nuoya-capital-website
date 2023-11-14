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

export async function getServerSideProps() {
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
        <title>Home | Nuoya Capital</title>
        <meta name="description" content="nuoya.capital" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col p-6">
        <Tabs variant="enclosed" defaultIndex={0}>
          <TabList>
            {users.map((u) => (
              <Tab key={u.name}>{u.name}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {users.map((u, index) => (
              <TabPanel
                style={{
                  padding: 0,
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                }}
                key={`${index}`}
              >
                <DataDisplay report={u?.report} />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
        <div className="absolute right-6 top-3">
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </div>
      </main>
      <footer className="text-sm text-center text-gray-500 pb-6">
        Copyright @ {new Date().getFullYear()} Nuoya Capital LLC. All rights
        reserved.
      </footer>
    </>
  )
}
