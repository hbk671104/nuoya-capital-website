"use client"

import { Button } from "@tremor/react"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
	return <Button onClick={() => signOut()}>Log Out</Button>
}
