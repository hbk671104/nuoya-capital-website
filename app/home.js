'use client'

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

import DataDisplay from './components/data-display'

export default function Home({ users }) {
  // const { colorMode, toggleColorMode } = useColorMode()
  return (
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
      {/* <div className="flex flex-row justify-end">
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div> */}
    </main>
  )
}
