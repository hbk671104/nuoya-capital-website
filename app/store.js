import store from "store"

export const setUser = (user) => store.set('user', user)
export const getUser = () => store.get('user')

export const setAccessToken = ({ accessToken, accessTokenExpiresAt }) => {
	const user = getUser()
	setUser({ ...user, accessToken, accessTokenExpiresAt })
}

export const setRefreshToken = (
	{ refreshToken, refreshTokenExpiresAt },
) => {
	const user = getUser()
	setUser({ ...user, refreshToken, refreshTokenExpiresAt })
}

