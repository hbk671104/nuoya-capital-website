"use client"

import { Button } from "@tremor/react"
import { RiLogoutBoxLine } from "@remixicon/react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
	return (
		<Button icon={RiLogoutBoxLine} color="red" onClick={() => signOut()}>
			Logout
		</Button>
	)
}
