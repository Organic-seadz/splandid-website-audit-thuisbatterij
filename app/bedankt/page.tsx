'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function BedanktContent() {
  const searchParams = useSearchParams()
  const bedrijfsnaam = searchParams.get('bedrijfsnaam') || 'uw bedrijf'
  const email = searchParams.get('email') || ''

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-4 px-6" style={{ backgroundColor: '#20267f' }}>
        <Link href="/">
          <span className="text-white text-xl font-bold tracking-tight hover:text-white/80 transition-colors">
            Splandid
          </span>
        </Link>
      </div>

      <div className="max-w-lg w-full mx-auto px-4 py-16 text-center">
        {/* Checkmark */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#20267f' }}>
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Analyse gestart
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed mb-2">
          Wij analyseren nu{' '}
          <span className="font-semibold text-gray-900">{decodeURIComponent(bedrijfsnaam)}</span>
          &apos;s website op 6 conversiecriteria.
        </p>
        {email && (
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            U ontvangt het rapport binnen 10 minuten op{' '}
            <span className="font-medium text-gray-700">{decodeURIComponent(email)}</span>.
          </p>
        )}
        {!email && (
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            U ontvangt het rapport binnen 10 minuten op uw e-mailadres.
          </p>
        )}

        {/* Info block */}
        <div className="rounded-xl p-5 mb-8 text-left" style={{ backgroundColor: '#20267f' }}>
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Wij controleren op</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Kooptrigger & urgentie',
              'Prijs & terugverdientijd',
              'Batterijadvies',
              'Online aanvraag',
              'Proces & verwachting',
              'Vertrouwen & bewijs',
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-white/80">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#fe6500' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://calendly.com/splandid/kennismaking"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-white font-semibold py-4 px-6 rounded-lg text-base transition-all duration-200 mb-4"
          style={{ backgroundColor: '#fe6500' }}
        >
          Plan alvast een gesprek met Stephan →
        </a>

        <p className="text-gray-400 text-sm">
          Vragen?{' '}
          <a href="mailto:stephan@splandid.nl" className="underline underline-offset-2 hover:text-gray-600 transition-colors">
            stephan@splandid.nl
          </a>
        </p>

        <div className="mt-10 pt-8 border-t border-gray-200">
          <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm transition-colors inline-flex items-center gap-1.5">
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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#20267f' }} />
      </main>
    }>
      <BedanktContent />
    </Suspense>
  )
}
