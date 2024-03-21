"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Select, SelectItem } from "@tremor/react"

const ThemeSelect = () => {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<Select value={theme} onValueChange={(value) => setTheme(value)}>
			<SelectItem value="system">System</SelectItem>
			<SelectItem value="dark">Dark</SelectItem>
			<SelectItem value="light">Light</SelectItem>
		</Select>
	)
}

export default ThemeSelect
