/**
 * Splandid Website Scan — Google Apps Script Webhook
 *
 * SETUP INSTRUCTIES:
 * 1. Maak een nieuw Google Sheet aan: "Splandid Website Scan Leads"
 * 2. Ga naar Extensies > Apps Script
 * 3. Plak deze volledige code in de editor
 * 4. Klik op Opslaan
 * 5. Klik op Implementeren > Nieuwe implementatie
 * 6. Kies type: Webapplicatie
 * 7. Uitvoeren als: Mijzelf
 * 8. Toegang verlenen aan: Iedereen
 * 9. Klik op Implementeren en kopieer de Web app URL
 * 10. Plak die URL als SHEETS_WEBHOOK_URL in Vercel environment variables
 */

const SHEET_NAME = 'Leads'

const HEADERS = [
  'Datum',
  'Naam',
  'Bedrijfsnaam',
  'Website',
  'E-mail',
  'Bezoekers/maand',
  'Aanvragen/maand',
  'Orderwaarde (€)',
  'Overall Score',
  'Conversieratio',
  'Conversie Oordeel',
  'Score: Kooptrigger',
  'Score: Prijs',
  'Score: Batterijadvies',
  'Score: Aanvraag',
  'Score: Proces',
  'Score: Vertrouwen',
  'Top 1 Actie',
  'Top 2 Actie',
  'Top 3 Actie',
  'Potentieel Jaaromzet (laag)',
  'Potentieel Jaaromzet (hoog)',
  'Slotoordeel',
  'Volledige JSON',
]

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    // Get or create the Leads sheet
    let sheet = ss.getSheetByName(SHEET_NAME)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME)
      sheet.appendRow(HEADERS)

      // Style header row
      const headerRange = sheet.getRange(1, 1, 1, HEADERS.length)
      headerRange.setBackground('#0B1120')
      headerRange.setFontColor('#FFFFFF')
      headerRange.setFontWeight('bold')
      sheet.setFrozenRows(1)

      // Set column widths
      sheet.setColumnWidth(1, 100)  // Datum
      sheet.setColumnWidth(2, 120)  // Naam
      sheet.setColumnWidth(3, 160)  // Bedrijfsnaam
      sheet.setColumnWidth(4, 200)  // Website
      sheet.setColumnWidth(5, 200)  // E-mail
      sheet.setColumnWidth(22, 300) // Slotoordeel
      sheet.setColumnWidth(23, 100) // JSON (hidden)
    }

    // Append data row
    sheet.appendRow([
      data.datum || new Date().toISOString().split('T')[0],
      data.naam || '',
      data.bedrijfsnaam || '',
      data.url || '',
      data.email || '',
      data.bezoekers || '',
      data.aanvragen || '',
      data.orderwaarde || 6500,
      data.overall_score || '',
      data.conversie_ratio || '',
      data.conversie_oordeel || '',
      data.score_kooptrigger ?? '',
      data.score_prijs ?? '',
      data.score_batterijadvies ?? '',
      data.score_aanvraag ?? '',
      data.score_proces ?? '',
      data.score_vertrouwen ?? '',
      data.top3_actie_1 || '',
      data.top3_actie_2 || '',
      data.top3_actie_3 || '',
      data.potentiele_jaaromzet_laag || '',
      data.potentiele_jaaromzet_hoog || '',
      data.slotoordeel || '',
      data.full_json || '',
    ])

    // Color-code score column based on overall_score
    if (data.overall_score !== null && data.overall_score !== undefined) {
      const lastRow = sheet.getLastRow()
      const scoreCell = sheet.getRange(lastRow, 9) // Column I = overall_score
      const score = Number(data.overall_score)

      if (score >= 70) {
        scoreCell.setBackground('#d4edda') // green
      } else if (score >= 40) {
        scoreCell.setBackground('#fff3cd') // yellow
      } else {
        scoreCell.setBackground('#f8d7da') // red
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// Test function — run this manually to verify the sheet works
function testWebhook() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        datum: '2026-03-25',
        naam: 'Test Gebruiker',
        bedrijfsnaam: 'Test BV',
        url: 'https://test.nl',
        email: 'test@test.nl',
        bezoekers: 500,
        aanvragen: 5,
        orderwaarde: 7500,
        overall_score: 42,
        conversie_ratio: '1.0%',
        conversie_oordeel: 'kritiek',
        score_kooptrigger: 0,
        score_prijs: 5,
        score_batterijadvies: 5,
        score_aanvraag: 0,
        score_proces: 5,
        score_vertrouwen: 5,
        top3_actie_1: 'Online aanvraagformulier toevoegen',
        top3_actie_2: 'Recente reviews verzamelen',
        top3_actie_3: 'Salderingsdeadline 2027 vermelden',
        potentiele_jaaromzet_laag: '€195.000',
        potentiele_jaaromzet_hoog: '€585.000',
        slotoordeel: 'Test slotoordeel.',
        full_json: '{}',
      }),
    },
  }
  doPost(testData)
  Logger.log('Test uitgevoerd — check het Leads tabblad')
}
