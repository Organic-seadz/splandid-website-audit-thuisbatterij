import FirecrawlApp from '@mendable/firecrawl-js'

function getFirecrawl() {
  return new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! })
}

const SUBPAGE_KEYWORDS = ['thuisbatterij', 'batterij', 'zonnepanelen', 'solar', 'accu', 'opslag']

export interface ScrapeResult {
  homepage_content: string
  subpage_content: string | null
  subpage_url: string | null
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  // Scrape homepage with a 20s timeout
  const homepageResult = await Promise.race([
    getFirecrawl().scrapeUrl(url, { formats: ['markdown', 'links'] }),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Homepage scrape timeout')), 20000)
    ),
  ])

  const homepage_content = (homepageResult as { markdown?: string }).markdown || ''
  const links: string[] = ((homepageResult as { links?: string[] }).links || []) as string[]

  // Find subpage URL from homepage links
  const subpageUrl =
    links.find((link: string) =>
      SUBPAGE_KEYWORDS.some((kw) => link.toLowerCase().includes(kw))
    ) || null

  // Scrape subpage in parallel with a 15s timeout (don't block if it fails)
  let subpage_content: string | null = null
  let subpage_url: string | null = null

  if (subpageUrl && subpageUrl !== url) {
    try {
      const subpageResult = await Promise.race([
        getFirecrawl().scrapeUrl(subpageUrl, { formats: ['markdown'] }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Subpage scrape timeout')), 15000)
        ),
      ])
      subpage_content = (subpageResult as { markdown?: string }).markdown || null
      subpage_url = subpageUrl
    } catch {
      // subpage scrape timed out or failed — proceed without
    }
  }

  return { homepage_content, subpage_content, subpage_url }
}
