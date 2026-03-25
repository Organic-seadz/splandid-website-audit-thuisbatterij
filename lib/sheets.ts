export interface SheetRow {
  naam: string
  bedrijfsnaam: string
  url: string
  email: string
  bezoekers: number | null
  aanvragen: number | null
  orderwaarde: number
  datum: string
  overall_score: number | null
  conversie_ratio: string | null
  conversie_oordeel: string | null
  score_kooptrigger: number | null
  score_prijs: number | null
  score_batterijadvies: number | null
  score_aanvraag: number | null
  score_proces: number | null
  score_vertrouwen: number | null
  top3_actie_1: string | null
  top3_actie_2: string | null
  top3_actie_3: string | null
  potentiele_jaaromzet_laag: string | null
  potentiele_jaaromzet_hoog: string | null
  slotoordeel: string | null
  full_json: string
}

export async function saveToSheets(row: SheetRow): Promise<void> {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('SHEETS_WEBHOOK_URL not configured, skipping sheets save')
    return
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(row),
  })

  if (!response.ok) {
    console.error('Failed to save to sheets:', response.status, await response.text())
  }
}
