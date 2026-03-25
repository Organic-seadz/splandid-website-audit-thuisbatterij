import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scrapeWebsite } from '@/lib/firecrawl'
import { runAudit } from '@/lib/claude'
import { saveToSheets } from '@/lib/sheets'

export const maxDuration = 60

const schema = z.object({
  naam: z.string().min(1, 'Naam is verplicht'),
  bedrijfsnaam: z.string().min(1, 'Bedrijfsnaam is verplicht'),
  url: z.string().url('Voer een geldige URL in'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  bezoekers: z.number().positive('Bezoekers moet een positief getal zijn').nullable().optional(),
  aanvragen: z.number().positive('Aanvragen moet een positief getal zijn').nullable().optional(),
  orderwaarde: z.number().positive('Orderwaarde moet een positief getal zijn').default(6500),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    // Scrape website
    const scraped = await scrapeWebsite(data.url)

    // Run audit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditResult = (await runAudit({
      bedrijfsnaam: data.bedrijfsnaam,
      url: data.url,
      bezoekers_per_maand: data.bezoekers ?? null,
      aanvragen_per_maand: data.aanvragen ?? null,
      orderwaarde: data.orderwaarde,
      homepage_content: scraped.homepage_content,
      subpage_content: scraped.subpage_content,
      subpage_url: scraped.subpage_url,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any

    // Save to Google Sheets via webhook
    await saveToSheets({
      naam: data.naam,
      bedrijfsnaam: data.bedrijfsnaam,
      url: data.url,
      email: data.email,
      bezoekers: data.bezoekers ?? null,
      aanvragen: data.aanvragen ?? null,
      orderwaarde: data.orderwaarde,
      datum: new Date().toISOString().split('T')[0],
      overall_score: auditResult?.overall_score ?? null,
      conversie_ratio: auditResult?.conversie?.ratio ?? null,
      conversie_oordeel: auditResult?.conversie?.oordeel ?? null,
      score_kooptrigger: auditResult?.criteria?.kooptrigger_urgentie?.score ?? null,
      score_prijs: auditResult?.criteria?.prijs_terugverdientijd?.score ?? null,
      score_batterijadvies: auditResult?.criteria?.batterijadvies_maatwerk?.score ?? null,
      score_aanvraag: auditResult?.criteria?.aanvraag_online_conversie?.score ?? null,
      score_proces: auditResult?.criteria?.proces_verwachting?.score ?? null,
      score_vertrouwen: auditResult?.criteria?.vertrouwen_bewijs?.score ?? null,
      top3_actie_1: auditResult?.top3_prioriteiten?.[0]?.actie ?? null,
      top3_actie_2: auditResult?.top3_prioriteiten?.[1]?.actie ?? null,
      top3_actie_3: auditResult?.top3_prioriteiten?.[2]?.actie ?? null,
      potentiele_jaaromzet_laag:
        auditResult?.impact_samenvatting?.potentiele_extra_jaaromzet?.laag ?? null,
      potentiele_jaaromzet_hoog:
        auditResult?.impact_samenvatting?.potentiele_extra_jaaromzet?.hoog ?? null,
      slotoordeel: auditResult?.slotoordeel ?? null,
      full_json: JSON.stringify(auditResult),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : ''
    console.error('Scan error:', msg, stack)

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { success: false, error: firstError?.message || 'Validatiefout in formulier' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Onbekende fout opgetreden',
      },
      { status: 500 }
    )
  }
}
