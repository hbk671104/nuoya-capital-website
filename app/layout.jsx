import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
	title: "Home | Nuoya Capital",
	description: "Bespoke investment solutions for the modern investor",
}

export default function RootLayout({ children }) {
	return (
		<html suppressHydrationWarning lang="en" className="antialiased">
			<body className={inter.className}>
				<ThemeProvider attribute="class">{children}</ThemeProvider>
			</body>
		</html>
	)
}
