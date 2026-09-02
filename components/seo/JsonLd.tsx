import { absoluteUrl, site, siteUrl } from '@/lib/site'

/**
 * Structured data.
 *
 * One small helper renders the tag and each exported component builds a single
 * graph node. Everything is a server component, so the JSON ships inside the
 * first HTML response and never waits on hydration.
 *
 * The Organization node carries a stable @id, so every other node on the site
 * can reference the publisher by id instead of repeating the whole record.
 */

/**
 * The one dangerous character inside a script element is the less than sign,
 * because the byte sequence `</script>` closes the element early even when it
 * sits inside a JSON string, and whatever follows is then parsed as markup.
 * So every `<` is rewritten as its six character JSON escape, backslash u zero
 * zero three c, which any JSON parser decodes straight back to `<`. The data is
 * therefore unchanged, and the closing sequence can no longer appear in the
 * response at all. The backslash in the replacement below is doubled because
 * the source has to emit a literal backslash followed by a u, not the escape
 * resolved at compile time.
 */
function serialise(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  )
}

/**
 * Sitewide, rendered once in the root layout.
 *
 * The logo points at the artwork in public/. Schema wants a real fetchable
 * raster, and Google reads this field as the organisation's mark rather than
 * as a social card, so the square seal is the right image: the 1200x630 Open
 * Graph card is mostly wordmark and rule work and would be cropped to
 * something meaningless. This is the full seal, the copy that carries the
 * name, since nothing here crops or shrinks it.
 */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: siteUrl,
        description: site.description,
        foundingDate: site.founded,
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/logo.png'),
          width: 1080,
          height: 1080,
        },
        image: absoluteUrl('/opengraph-image'),
        // PLACEHOLDER. The telephone number and the postal address below come
        // from lib/site.ts and are sample data. Replace both there, not here,
        // before the site goes live: a wrong address in structured data is
        // read by Google as a real business location.
        telephone: site.phone,
        email: site.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: site.phone,
          email: site.email,
          availableLanguage: 'English',
        },
        sameAs: Object.values(site.social),
      }}
    />
  )
}

export type Crumb = { name: string; href: string }

/**
 * One per page, including the home page. The current page is the last item, so
 * positions run from one to items.length. Every page renders this, so it stays
 * deliberately cheap: no lookups, no content imports, just a map.
 */
export function BreadcrumbJsonLd({ items }: { items: Crumb[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.href),
        })),
      }}
    />
  )
}

/**
 * One per service page. The page passes its own copy rather than this file
 * reaching into content/services.ts, so a service page can describe itself in
 * search results with the same words it shows on screen.
 */
export function ServiceJsonLd({
  name,
  description,
  href,
  serviceType,
  areaServed = 'Worldwide',
}: {
  name: string
  description: string
  /** Site relative path, made absolute here. */
  href: string
  /** Defaults to the service name when the page has nothing more specific. */
  serviceType?: string
  areaServed?: string
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        serviceType: serviceType ?? name,
        url: absoluteUrl(href),
        // By reference, not by value: the Organization node in the layout is
        // the single description of the publisher.
        provider: { '@id': `${siteUrl}/#organization` },
        areaServed,
      }}
    />
  )
}

/**
 * The FAQ graph, for the FAQ page and for the home page question section.
 *
 * Google now shows FAQ rich results only for a small set of government and
 * health sites, so this is here because the answers are genuinely marked up
 * correctly, not because it will produce stars in the search listing. Do not
 * promise anyone otherwise.
 *
 * Schema wants one plain text answer, so the paragraphs are joined with a
 * space. Nothing else is stripped: the copy is already plain prose.
 */
export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string[] }[]
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer.join(' '),
          },
        })),
      }}
    />
  )
}
