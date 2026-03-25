import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { scrapeWebsite } from '@/lib/firecrawl'
import { runAudit } from '@/lib/claude'
import { saveToSheets } from '@/lib/sheets'

export const maxDuration = 60

const MAX_HOMEPAGE_CHARS = 5000
const MAX_SUBPAGE_CHARS = 3000

const schema = z.object({
  naam: z.string().min(1, 'Naam is verplicht'),
  bedrijfsnaam: z.string().min(1, 'Bedrijfsnaam is verplicht'),
  url: z.string().url('Voer een geldige URL in'),
  email: z.string().email('Voer een geldig e-mailadres in'),
  bezoekers: z.number().positive('Bezoekers moet een positief getal zijn').nullable().optional(),
  aanvragen: z.number().positive('Aanvragen moet een positief getal zijn').nullable().optional(),
  orderwaarde: z.number().positive('Orderwaarde moet een positief getal zijn').default(6500),
})

function safeLog(label: string, value: unknown) {
  try {
    process.stdout.write(label + ': ' + (typeof value === 'string' ? value : JSON.stringify(value)) + '\n')
  } catch {
    process.stdout.write(label + ': [onlogbaar]\n')
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    safeLog('STAP 1', 'Validatie OK, start scrape van ' + data.url)

    // Scrape website
    let scraped
    try {
      scraped = await scrapeWebsite(data.url)
      safeLog('STAP 2', 'Scrape OK, homepage lengte: ' + scraped.homepage_content.length)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      safeLog('STAP 2 FOUT', msg)
      return NextResponse.json({ success: false, error: 'Website scrapen mislukt: ' + msg }, { status: 500 })
    }

    // Truncate content to reduce Claude input tokens
    const homepage_content = scraped.homepage_content.slice(0, MAX_HOMEPAGE_CHARS)
    const subpage_content = scraped.subpage_content?.slice(0, MAX_SUBPAGE_CHARS) ?? null

    // Save lead to Sheets FIRST — ensures lead is always captured even if Claude times out
    try {
      await saveToSheets({
        naam: data.naam,
        bedrijfsnaam: data.bedrijfsnaam,
        url: data.url,
        email: data.email,
        bezoekers: data.bezoekers ?? null,
        aanvragen: data.aanvragen ?? null,
        orderwaarde: data.orderwaarde,
        datum: new Date().toISOString().split('T')[0],
        overall_score: null,
        conversie_ratio: null,
        conversie_oordeel: null,
        score_kooptrigger: null,
        score_prijs: null,
        score_batterijadvies: null,
        score_aanvraag: null,
        score_proces: null,
        score_vertrouwen: null,
        top3_actie_1: null,
        top3_actie_2: null,
        top3_actie_3: null,
        potentiele_jaaromzet_laag: null,
        potentiele_jaaromzet_hoog: null,
        slotoordeel: 'Analyse in verwerking...',
        full_json: '',
      })
      safeLog('STAP 3', 'Lead opgeslagen in Sheets')
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      safeLog('STAP 3 FOUT (Sheets)', msg)
      // Non-fatal — continue with audit
    }

    // Run Claude audit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let auditResult: any
    try {
      auditResult = await runAudit({
        bedrijfsnaam: data.bedrijfsnaam,
        url: data.url,
        bezoekers_per_maand: data.bezoekers ?? null,
        aanvragen_per_maand: data.aanvragen ?? null,
        orderwaarde: data.orderwaarde,
        homepage_content,
        subpage_content,
        subpage_url: scraped.subpage_url,
      })
      safeLog('STAP 4', 'Claude audit OK, score: ' + auditResult?.overall_score)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      safeLog('STAP 4 FOUT (Claude)', msg)
      // Lead is already in Sheets — return success to user
      return NextResponse.json({ success: true })
    }

    // Update Sheets with audit scores
    try {
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
        potentiele_jaaromzet_laag: auditResult?.impact_samenvatting?.potentiele_extra_jaaromzet?.laag ?? null,
        potentiele_jaaromzet_hoog: auditResult?.impact_samenvatting?.potentiele_extra_jaaromzet?.hoog ?? null,
        slotoordeel: auditResult?.slotoordeel ?? null,
        full_json: JSON.stringify(auditResult),
      })
      safeLog('STAP 5', 'Audit scores opgeslagen in Sheets')
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      safeLog('STAP 5 FOUT (Sheets update)', msg)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    safeLog('ALGEMENE FOUT', msg)

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return NextResponse.json(
        { success: false, error: firstError?.message || 'Validatiefout in formulier' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: msg || 'Onbekende fout opgetreden' },
      { status: 500 }
    )
  }
}
