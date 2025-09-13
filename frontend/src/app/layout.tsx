import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CustomThemeProvider } from '@/lib/theme'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DigiRation - Ration Shop App',
  description: 'A Progressive Web App for ration shop customers',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CustomThemeProvider>
          {children}
        </CustomThemeProvider>
      </body>
    </html>
  )
}
