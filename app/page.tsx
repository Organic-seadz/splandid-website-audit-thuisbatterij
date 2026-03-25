'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface FormData {
  naam: string
  bedrijfsnaam: string
  url: string
  email: string
  bezoekers: string
  aanvragen: string
  orderwaarde: string
}

const initialFormData: FormData = {
  naam: '',
  bedrijfsnaam: '',
  url: '',
  email: '',
  bezoekers: '',
  aanvragen: '',
  orderwaarde: '6500',
}

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const payload = {
      naam: formData.naam.trim(),
      bedrijfsnaam: formData.bedrijfsnaam.trim(),
      url: formData.url.trim(),
      email: formData.email.trim(),
      bezoekers: formData.bezoekers ? Number(formData.bezoekers) : null,
      aanvragen: formData.aanvragen ? Number(formData.aanvragen) : null,
      orderwaarde: formData.orderwaarde ? Number(formData.orderwaarde) : 6500,
    }

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Er is een fout opgetreden. Probeer het opnieuw.')
      }

      const params = new URLSearchParams({
        bedrijfsnaam: formData.bedrijfsnaam.trim(),
        email: formData.email.trim(),
      })
      router.push(`/bedankt?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een onbekende fout opgetreden.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-navy relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            {/* Spinner */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-semibold mb-2">Website wordt geanalyseerd...</p>
              <p className="text-gray-400 text-sm max-w-xs text-center">
                We scrapen uw website, analyseren 6 conversiecriteria en berekenen uw omzetpotentieel.
              </p>
            </div>
            {/* Progress dots */}
            <div className="flex gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-orange animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-orange animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-orange animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange text-2xl font-bold tracking-tight">Splandid</span>
          </div>
          <p className="text-gray-500 text-sm">Website Audit voor Thuisbatterij-installateurs</p>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4 text-balance">
            Ontdek wat uw website{' '}
            <span className="text-orange">u kost</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Wij analyseren uw website op 6 conversiecriteria en laten u zien wat u per jaar misloopt.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { icon: '✓', text: 'Gratis analyse' },
            { icon: '✓', text: 'Geen verplichtingen' },
            { icon: '✓', text: 'Rapport binnen 10 minuten' },
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-1.5 text-sm text-gray-300">
              <span className="text-orange font-bold">{badge.icon}</span>
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-semibold text-lg mb-6">Vul uw gegevens in</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">Fout bij analyse</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Naam */}
            <div>
              <label htmlFor="naam" className="block text-sm font-medium text-gray-300 mb-1.5">
                Uw naam
              </label>
              <input
                id="naam"
                name="naam"
                type="text"
                required
                value={formData.naam}
                onChange={handleChange}
                placeholder="Jan de Vries"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* Bedrijfsnaam */}
            <div>
              <label htmlFor="bedrijfsnaam" className="block text-sm font-medium text-gray-300 mb-1.5">
                Bedrijfsnaam
              </label>
              <input
                id="bedrijfsnaam"
                name="bedrijfsnaam"
                type="text"
                required
                value={formData.bedrijfsnaam}
                onChange={handleChange}
                placeholder="Solar Installaties B.V."
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* Website URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1.5">
                Website URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                value={formData.url}
                onChange={handleChange}
                placeholder="https://www.uwbedrijf.nl"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* E-mailadres */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                E-mailadres
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jan@uwbedrijf.nl"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* Bezoekers */}
            <div>
              <label htmlFor="bezoekers" className="block text-sm font-medium text-gray-300 mb-1.5">
                Gemiddeld aantal bezoekers per maand
              </label>
              <input
                id="bezoekers"
                name="bezoekers"
                type="number"
                min="1"
                required
                value={formData.bezoekers}
                onChange={handleChange}
                placeholder="bijv. 800"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* Aanvragen */}
            <div>
              <label htmlFor="aanvragen" className="block text-sm font-medium text-gray-300 mb-1.5">
                Gemiddeld aantal online aanvragen per maand{' '}
                <span className="text-gray-500 font-normal">(optioneel — voor persoonlijkere impactberekening)</span>
              </label>
              <input
                id="aanvragen"
                name="aanvragen"
                type="number"
                min="0"
                value={formData.aanvragen}
                onChange={handleChange}
                placeholder="bijv. 12"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
            </div>

            {/* Orderwaarde */}
            <div>
              <label htmlFor="orderwaarde" className="block text-sm font-medium text-gray-300 mb-1.5">
                Gemiddelde orderwaarde in &euro;{' '}
                <span className="text-gray-500 font-normal">(optioneel — voor persoonlijkere impactberekening)</span>
              </label>
              <input
                id="orderwaarde"
                name="orderwaarde"
                type="number"
                min="1"
                value={formData.orderwaarde}
                onChange={handleChange}
                placeholder="6500"
                className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange/60 focus:ring-1 focus:ring-orange/40 transition-colors"
              />
              <p className="mt-1.5 text-xs text-gray-500">Standaardwaarde: €6.500 per installatie</p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-orange hover:bg-orange/90 disabled:bg-orange/50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange/20 hover:shadow-orange/30"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse wordt gestart...
                  </>
                ) : (
                  <>
                    Analyseer mijn website
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm leading-relaxed">
            De analyse is volledig gratis en zonder verplichtingen.
            <br />
            U ontvangt het rapport binnen 10 minuten op uw e-mailadres.*
          </p>
          <p className="text-gray-600 text-xs mt-3">
            * Het rapport wordt direct na de analyse per e-mail verzonden door Splandid.
          </p>
        </div>
      </div>
    </main>
  )
}
