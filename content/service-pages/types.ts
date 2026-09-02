/**
 * The shape of a long form service page.
 *
 * Each service in content/services.ts carries the short copy: the name, the one
 * liner, the meta description. This file describes the long copy that lives
 * underneath it, written as an ordered run of blocks rather than as a fixed set
 * of named fields, so a page can be as long as its subject deserves and the
 * route can give each block kind its own typographic treatment.
 *
 * Blocks are content, not layout. Nothing here names a colour, a width or a
 * component. The route in app/services/[slug]/page.tsx decides how a `callout`
 * is set, and a content file never has an opinion about it.
 */

/** The seven services. Written out so the registry below cannot miss one. */
export type ServiceSlug =
  | 'ghostwriting'
  | 'editing'
  | 'cover-design'
  | 'publishing'
  | 'audiobook'
  | 'book-marketing'
  | 'author-website'

export type ServicePageBlock =
  | { kind: 'prose'; heading?: string; paragraphs: string[] }
  | { kind: 'list'; heading: string; intro?: string; items: { term: string; detail: string }[] }
  | { kind: 'steps'; heading: string; intro?: string; steps: { name: string; detail: string; timeframe?: string }[] }
  | { kind: 'callout'; heading: string; paragraphs: string[] }

export type ServicePage = {
  slug: string
  h1: string
  lede: string
  blocks: ServicePageBlock[]
  faqs: { question: string; answer: string[] }[]
  priceFrom?: string
  relatedSlugs: string[]
}

/**
 * Keyed by slug and complete: adding a service to the union above and failing
 * to write its page is a type error rather than a page that renders empty.
 */
export type ServicePageRegistry = Record<ServiceSlug, ServicePage>
