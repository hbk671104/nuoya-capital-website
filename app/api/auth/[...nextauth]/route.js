import NextAuth from "next-auth"

export const authOptions = {
  providers: [
    {
      id: "schwab",
      name: "Charles Schwab",
      type: "oauth",
      version: "2.0",
      clientId: process.env.SCHWAB_KEY,
      clientSecret: process.env.SCHWAB_SECRET,
      authorization: "https://api.schwabapi.com/v1/oauth/authorize",
      token: "https://api.schwabapi.com/v1/oauth/token",
      userinfo: "https://api.schwabapi.com/trader/v1/userPreferences",
      profile(profile) {
        // TODO: Implement user profile
        return {
          id: null,
          name: null,
          email: null,
          image: null,
        }
      },
    }
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }