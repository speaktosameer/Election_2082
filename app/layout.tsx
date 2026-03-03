import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nepal Election 2082 - Interactive Visualization & Analysis',
  description:
    'Explore interactive visualizations and AI-powered analysis of Nepal\'s 2082 election candidate data. Discover demographics, party statistics, geographic distribution, and get instant insights via AI.',
  keywords: [
    'Nepal',
    'Election 2082',
    'Candidates',
    'Visualization',
    'Analytics',
    'Democracy',
  ],
  authors: [{ name: 'Election 2082 Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
