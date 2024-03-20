import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Home | Nuoya Capital",
	description: "Bespoke investment solutions for the modern investor",
}

export default function RootLayout({ children }) {
	return (
		<html lang="en" className="antialiased bg-slate-50 dark:bg-slate-950">
			<body className={inter.className}>{children}</body>
		</html>
	)
}
