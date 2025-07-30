import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ReactScan } from './ReactScan'
import localFont from 'next/font/local'

// === Custom local fonts ===
const geist = localFont({
  src: '../assets/fonts/GeistVF.woff',
  variable: '--font-geist',
  display: 'swap',
})

const geistMono = localFont({
  src: '../assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pallas Pay',
  description: 'Square Integration for Pallas Pay',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <ReactScan />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
