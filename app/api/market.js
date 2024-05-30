import got from "got"

const options = {
  prefixUrl: 'https://api.schwabapi.com/marketdata/v1',
};

const client = got.extend(options)

export const getQuotes = ({ session, symbols }) => {
  const accessToken = session.account?.access_token

  return client(
    'quotes',
    {
      searchParams: {
        symbols,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).json()
}