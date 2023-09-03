// import { extendTheme } from '@chakra-ui/react'
// import { ColorModeScript } from '@chakra-ui/react'
// const config = {
//   initialColorMode: 'system',
//   useSystemColorMode: false,
// }
// const theme = extendTheme({ config })

import '../styles/globals.css'
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
        <Providers>
          {/* 👇 Here's the script */}
          {/* <ColorModeScript initialColorMode={theme.config?.initialColorMode} /> */}
          {children}
        </Providers>
      </body>
    </html>
  )
}
