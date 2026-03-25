'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function BedanktContent() {
  const searchParams = useSearchParams()
  const bedrijfsnaam = searchParams.get('bedrijfsnaam') || 'uw bedrijf'
  const email = searchParams.get('email') || ''

  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <span className="text-orange text-xl font-bold tracking-tight hover:text-orange/80 transition-colors">
              Splandid
            </span>
          </Link>
        </div>

        {/* Checkmark icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-500/15 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/25 flex items-center justify-center">
                <svg
                  className="w-9 h-9 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
          Analyse gestart
        </h1>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed mb-2">
          Wij analyseren nu{' '}
          <span className="text-white font-semibold">{decodeURIComponent(bedrijfsnaam)}</span>
          &apos;s website op 6 conversiecriteria.
        </p>
        {email && (
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            U ontvangt het rapport binnen 10 minuten op{' '}
            <span className="text-white font-medium">{decodeURIComponent(email)}</span>.
          </p>
        )}
        {!email && (
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            U ontvangt het rapport binnen 10 minuten op uw e-mailadres.
          </p>
        )}

        {/* Company info block */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-left">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">Uw aanvraag</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">{decodeURIComponent(bedrijfsnaam)}</p>
              <p className="text-gray-400 text-sm">Wordt nu geanalyseerd</p>
            </div>
          </div>

          {/* What we analyze */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-gray-500 text-xs mb-3">Wij controleren op:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Kooptrigger & urgentie',
                'Prijs & terugverdientijd',
                'Batterijadvies',
                'Online aanvraag',
                'Proces & verwachting',
                'Vertrouwen & bewijs',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://calendly.com/splandid/kennismaking"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-orange hover:bg-orange/90 text-white font-semibold py-4 px-6 rounded-lg text-base transition-all duration-200 shadow-lg shadow-orange/20 hover:shadow-orange/30 mb-4"
        >
          Plan alvast een gesprek met Stephan
          <span className="ml-2 text-white/70 text-sm font-normal">→</span>
        </a>

        {/* Secondary text */}
        <p className="text-gray-500 text-sm">
          Heeft u vragen?{' '}
          <a
            href="mailto:stephan@splandid.nl"
            className="text-gray-300 hover:text-white underline underline-offset-2 transition-colors"
          >
            Mail naar stephan@splandid.nl
          </a>
        </p>

        {/* Back link */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Terug naar de homepage
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function BedanktPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-orange rounded-full animate-spin" />
      </main>
    }>
      <BedanktContent />
    </Suspense>
  )
}
