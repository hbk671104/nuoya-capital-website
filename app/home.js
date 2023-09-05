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
    <main className="py-4">
      <Tabs align="center" variant="soft-rounded">
        <TabList>
          {users.map((u) => (
            <Tab key={u.name}>{u?.name}</Tab>
          ))}
        </TabList>
        <TabPanels className="sm:max-w-lg">
          {users.map((u) => (
            <TabPanel key={u.name}>
              <DataDisplay report={u?.report} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <div className="fixed bottom-4 right-4">
        <IconButton
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </div>
    </main>
  )
}
