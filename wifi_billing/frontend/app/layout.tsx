import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Powerbeam WiFi - Fast, Reliable Internet Access',
  description: 'WiFi Billing System - Fast, reliable, and affordable internet access powered by M-Pesa payments in Kenya.',
  keywords: ['WiFi', 'internet', 'billing', 'M-Pesa', 'Kenya', 'Powerbeam', 'WiFi packages'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`} // Apply font variables as classes
    >
      <body>{children}</body>
    </html>
  )
}
