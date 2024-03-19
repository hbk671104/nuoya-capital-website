const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await Promise.all([
    prisma.user.create({
      data: {
        id: Number(process.env.ACCOUNT_ID_NUOYA),
        name: 'Nuoya',
        refreshToken: process.env.REFRESH_TOKEN_NUOYA
      }
    }),
    prisma.user.create({
      data: {
        id: Number(process.env.ACCOUNT_ID_WEI),
        name: 'Wei',
        refreshToken: process.env.REFRESH_TOKEN_WEI
      }
    })])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })