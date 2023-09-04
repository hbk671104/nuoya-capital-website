import Home from './home'

import { generateReport } from './lib/report'
import { nuoya, wei } from './lib/account'

async function getUsers() {
  let users = [nuoya, wei]
  const reports = await Promise.all(users.map((u) => generateReport(u)))
  users = users.map((u, i) => ({ ...u, report: reports[i] }))

  return users
}

export default async function Page() {
  const users = await getUsers()
  return <Home users={users} />
}
