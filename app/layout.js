import './styles/globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Nuoya Capital',
  description:
    'Welcome to Nuoya Capital - a place to track your assets and liabilities.',
}

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
