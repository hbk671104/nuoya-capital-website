import NextAuth from "next-auth"
import { getRefreshToken } from "@/api/auth"

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
        url: "https://api.schwabapi.com/trader/v1/userPreference"
      },
      profile({ accounts }) {
        const mainAccount = accounts.find((account) => !!account.primaryAccount)
        return {
          id: mainAccount.accountNumber,
          name: mainAccount.accountNumber,
          type: mainAccount.type
        }
      },
    }
  ],
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 5 * 24 * 60 * 60, //  5 days
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken

      return session
    }
  },
  debug: process.env.NODE_ENV !== "production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }