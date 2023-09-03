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
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <main className="px-12 py-8">
      <Tabs align="center" variant="soft-rounded">
        <TabList>
          {users.map((u) => (
            <Tab key={u.name}>{u?.name}</Tab>
          ))}
        </TabList>
        <TabPanels className="max-w-lg">
          {users.map((u, index) => (
            <TabPanel key={u.name}>
              <DataDisplay report={u?.report} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <div className="fixed bottom-6 right-9">
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div>
    </main>
  )
}
