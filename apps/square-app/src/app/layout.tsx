import './globals.css'
import { ReactScan } from './ReactScan'
import { Providers } from './providers'
import localFont from 'next/font/local'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route' // adjust if path differs

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <ReactScan />
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
