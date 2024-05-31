import NextAuth from "next-auth"
import dayjs from "dayjs"
import { getRefreshToken, getAccessToken } from "@/api/auth"
import { getUserInfo } from "@/api/account"

export const authOptions = {
  providers: [
    {
      id: "schwab",
      name: "Charles Schwab",
      type: "oauth",
      version: "2.0",
      clientId: process.env.SCHWAB_KEY,
      clientSecret: process.env.SCHWAB_SECRET,
      authorization: {
        url: "https://api.schwabapi.com/v1/oauth/authorize",
        params: {
          scope: "readonly",
        },
      },
      token: {
        url: "https://api.schwabapi.com/v1/oauth/token",
        async request(context) {
          // context contains useful properties to help you make the request.
          const res = await getRefreshToken(context)
          return {
            tokens: {
              ...res,
              id_token: null,
            }
          }
        }
      },
      userinfo: {
        async request({ tokens }) {
          const users = await getUserInfo({ accessToken: tokens.access_token })
          return users
        },
      },
      profile(users) {
        const mainAccount = users[0]
        return {
          id: mainAccount.accountNumber,
          name: mainAccount.accountNumber,
          ...mainAccount
        }
      },
    }
  ],
  session: {
    // How long until an idle session expires and is no longer valid.
    maxAge: 5 * 24 * 60 * 60, //  5 days
  },
  callbacks: {
    async jwt(context) {
      const { token, account, profile } = context
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.account = account
      }
      if (profile) {
        token.profile = profile
      }

      // Check if the token is expired and refresh it if necessary
      const accessTokenExpires = dayjs.unix(token.account.expires_at)
      const now = dayjs()
      if (accessTokenExpires.isBefore(now)) {
        const res = await getAccessToken({ account: token.account })
        return {
          ...token,
          account: {
            ...token.account,
            refresh_token: res.refresh_token ?? token.account.refresh_token,
            access_token: res.access_token,
            expires_at: dayjs().add(res.expires_in, "second").unix()
          }
        }
      }

      return token
    },
    async session(context) {
      const { session, token } = context
      // Send properties to the client, like an access_token and user id from a provider.
      session.account = token.account
      session.profile = token.profile

      return session
    }
  },
  debug: process.env.NODE_ENV !== "production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }