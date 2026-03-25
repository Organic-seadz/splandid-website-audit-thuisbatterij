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
  // 1. Scrape homepage - get markdown and links
  const homepageResult = await getFirecrawl().scrapeUrl(url, {
    formats: ['markdown', 'links'],
  })

  const homepage_content = (homepageResult as { markdown?: string }).markdown || ''
  const links: string[] = ((homepageResult as { links?: string[] }).links || []) as string[]

  // 2. Find subpage: look for links containing keywords
  const subpageUrl =
    links.find((link: string) =>
      SUBPAGE_KEYWORDS.some((kw) => link.toLowerCase().includes(kw))
    ) || null

  let subpage_content: string | null = null
  let subpage_url: string | null = null

  if (subpageUrl && subpageUrl !== url) {
    try {
      const subpageResult = await getFirecrawl().scrapeUrl(subpageUrl, {
        formats: ['markdown'],
      })
      subpage_content = (subpageResult as { markdown?: string }).markdown || null
      subpage_url = subpageUrl
    } catch {
      // subpage scrape failed, proceed without
    }
  }

  return { homepage_content, subpage_content, subpage_url }
}
