import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { ReactScan } from './ReactScan'

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
    <html lang="en">
      <ReactScan />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
