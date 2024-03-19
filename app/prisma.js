import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const getUsers = () =>
  prisma.user.findMany()

export const updateAccessToken = (id, { accessToken, accessTokenExpiresAt }) =>
  prisma.user.update({
    where: { id },
    data: { accessToken, accessTokenExpiresAt }
  })

export const updateRefreshToken = (id, { refreshToken, refreshTokenExpiresAt }) =>
  prisma.user.update({
    where: { id },
    data: { refreshToken, refreshTokenExpiresAt }
  })