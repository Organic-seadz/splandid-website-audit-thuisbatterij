import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Website Scan | Splandid',
  description:
    'Ontdek wat uw website u kost. Splandid analyseert uw website op 6 conversiecriteria en laat u zien hoeveel omzet u per jaar misloopt.',
  keywords: 'website audit, thuisbatterij, conversie optimalisatie, Splandid',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white font-sans antialiased">{children}</body>
    </html>
  )
}
