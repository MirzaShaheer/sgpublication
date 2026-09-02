import type { Metadata } from 'next'

import { FaqSection } from '@/components/home/FaqSection'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { faqs } from '@/content/faqs'
import { packageGuarantees, packages, packagesCopy } from '@/content/packages'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * Packages and pricing, in full.
 *
 * The home page names the three tiers. This page has to let someone choose
 * between them, which is a different job, so it carries the thing the home
 * page cannot: a row by row comparison where every feature appears once and
 * each tier either has it or does not.
 *
 * The comparison is a real <table> with row headers, not a grid of divs. A
 * pricing comparison is tabular data, screen readers announce which column a
 * cell belongs to only if it is marked up as one, and "included" is written as
 * a word rather than drawn as a tick so it survives being read aloud.
 *
 * PLACEHOLDER PRICING throughout, from content/packages.ts. Stated in visible
 * copy as well as in this comment so it cannot ship unnoticed.
 */

const title = 'Packages and pricing'
const description =
  'Three publishing packages, from a finished manuscript taken to market to a ghostwritten book with a managed launch. Every price, what is in each tier, what it costs to add on, and the three things that never change.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/packages') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/packages'),
  },
}

/**
 * Every feature named across the three tiers, in the order it first appears,
 * with the set of tiers that carry it. A tier inherits everything from the
 * tier it names in `inherits`, so the table resolves that chain rather than
 * making the reader do it.
 */
function buildComparison() {
  const bySlug = new Map(packages.map((tier) => [tier.slug, tier]))
  const byName = new Map(packages.map((tier) => [tier.name, tier]))

  /** Everything a tier carries, following the inherits chain upwards. */
  const resolved = new Map<string, Set<string>>()
  for (const tier of packages) {
    const all = new Set<string>()
    let cursor: (typeof packages)[number] | undefined = tier
    const guard = new Set<string>()
    while (cursor && !guard.has(cursor.slug)) {
      guard.add(cursor.slug)
      cursor.features.forEach((feature) => all.add(feature))
      cursor = cursor.inherits ? byName.get(cursor.inherits) : undefined
    }
    resolved.set(tier.slug, all)
  }

  const rows: { feature: string; has: Record<string, boolean> }[] = []
  const seen = new Set<string>()
  for (const tier of packages) {
    for (const feature of tier.features) {
      if (seen.has(feature)) continue
      seen.add(feature)
      rows.push({
        feature,
        has: Object.fromEntries(
          packages.map((other) => [
            other.slug,
            resolved.get(other.slug)?.has(feature) ?? false,
          ]),
        ),
      })
    }
  }

  return { rows, bySlug }
}

/** The money questions, answered on the page that asks for money. */
const moneyFaqs = faqs.filter(
  (faq) => faq.category === 'Money' || faq.category === 'Rights',
)

export default function PackagesPage() {
  const { rows } = buildComparison()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Packages', href: '/packages' },
        ]}
      />

      {/* ---- opening ---------------------------------------------------- */}
      <Section size="lg" labelledBy="packages-title">
        <Container>
          <p className="marker text-gold-ink">Packages</p>
          <h1 id="packages-title" className="mt-5 max-w-[17ch] text-hero">
            {packagesCopy.heading}
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            {packagesCopy.lede}
          </p>
          <p className="measure-wide mt-5 text-ink-soft">
            {packagesCopy.priceNote}
          </p>
          <p className="measure-wide mt-5 text-small text-gold-ink">
            Sample pricing shown for layout. Confirm every figure before launch.
          </p>
        </Container>
      </Section>

      {/* ---- the three tiers -------------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="tiers-title">
        <Container>
          <h2 id="tiers-title" className="sr-only">
            The three packages
          </h2>

          <div className="grid gap-x-10 gap-y-12 lg:grid-cols-3">
            {packages.map((tier) => (
              <div key={tier.slug} className={tier.promoted ? 'lg:-mt-4' : undefined}>
                <hr className={tier.promoted ? 'rule-gold' : 'rule-quiet'} />

                <div className="flex items-baseline justify-between gap-4 pt-5">
                  <h3 className="marker text-gold-ink">{tier.name}</h3>
                  {tier.ribbon ? (
                    <p className="marker text-ink-soft">{tier.ribbon}</p>
                  ) : null}
                </div>

                {/* Same treatment as the home page: the price paid leads, the
                    full price sits beside it struck through. */}
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-display text-h2 leading-none">
                    {tier.priceLabel}
                  </span>
                  {tier.fullPriceLabel ? (
                    <span className="font-display text-h4 leading-none text-ink-soft line-through decoration-gold decoration-1">
                      {tier.fullPriceLabel}
                    </span>
                  ) : null}
                </p>
                {tier.discountLabel ? (
                  <p className="marker mt-2.5 text-gold-ink">
                    {tier.discountLabel}
                  </p>
                ) : null}
                <p className="mt-3 text-small text-ink-soft">{tier.audience}</p>
                <p className="mt-5 text-small">{tier.summary}</p>
                <p className="mt-5 text-fine text-ink-soft">{tier.timeframe}</p>

                <p className="mt-7">
                  <ButtonLink
                    href={contactHref}
                    variant={tier.promoted ? 'primary' : 'secondary'}
                  >
                    Talk about {tier.name}
                  </ButtonLink>
                </p>
              </div>
            ))}
          </div>

          {/* The three guarantees, carried by every tier without exception. */}
          <div className="mt-14">
            <hr className="rule-gold" />
            <ul className="grid gap-x-10 gap-y-4 pt-6 sm:grid-cols-3">
              {packageGuarantees.map((guarantee) => (
                <li key={guarantee} className="font-display text-h4">
                  {guarantee}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* ---- the comparison --------------------------------------------- */}
      <Section ruled labelledBy="compare-title">
        <Container>
          <h2 id="compare-title" className="max-w-[20ch] text-h2">
            Line by line
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            Every feature across the three, once each. Inherited features are
            resolved here rather than left for you to work out.
          </p>

          {/* Wide tables scroll inside their own box; the page never does. */}
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                What is included in each package
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[45%] pb-3 align-bottom">
                    <span className="marker text-ink-soft">Included</span>
                  </th>
                  {packages.map((tier) => (
                    <th key={tier.slug} scope="col" className="pb-3 align-bottom">
                      <span className="marker block text-gold-ink">
                        {tier.name}
                      </span>
                      <span className="mt-1.5 block font-display text-h4">
                        {tier.priceLabel}
                        {tier.fullPriceLabel ? (
                          <span className="ml-2 text-small font-normal text-ink-soft line-through decoration-gold decoration-1">
                            {tier.fullPriceLabel}
                          </span>
                        ) : null}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-t border-paper-3">
                    <th
                      scope="row"
                      className="py-3.5 pr-6 align-top text-small font-normal text-ink-soft"
                    >
                      {row.feature}
                    </th>
                    {packages.map((tier) => (
                      <td key={tier.slug} className="py-3.5 pr-6 align-top">
                        {row.has[tier.slug] ? (
                          <span className="flex items-center gap-2 text-small">
                            {/* Drawn mark plus a word: the word is what a
                                screen reader reads, the mark is what an eye
                                scans down the column. */}
                            <span
                              aria-hidden="true"
                              className="h-px w-3 shrink-0 bg-gold"
                            />
                            Included
                          </span>
                        ) : (
                          <span className="text-small text-ink-soft/60">
                            Not included
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="rule-quiet" aria-hidden="true" />
        </Container>
      </Section>

      {/* ---- add ons ----------------------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="addons-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
            {/* The priced add ons list was removed with the new pricing: every
                figure on it was set against the old package prices. Anything
                outside a package is quoted individually instead. */}
            <div>
              <h2 id="addons-title" className="text-h2">
                Need something not on the list?
              </h2>
              <p className="measure mt-5 text-ink-soft">
                Ghostwriting, audiobook production and a full marketing campaign
                sit outside these packages, because the cost depends entirely on
                the length of your book.
              </p>
              <p className="measure mt-4 text-ink-soft">
                Tell us what you need and we will send a written quote.
              </p>
              <p className="mt-7">
                <ButtonLink href="/services#quote">Request a quote</ButtonLink>
              </p>
            </div>

            <div className="lg:pt-20">
              <hr className="rule-gold" aria-hidden="true" />
              <p className="marker mt-4 text-gold-ink">Between two tiers?</p>
              <p className="measure mt-3 text-small text-ink-soft">
                Say so on the call. We will tell you which one fits, even when
                the answer is the cheaper one.
              </p>
              <p className="mt-6">
                <ButtonLink href="/services" variant="quiet">
                  Price the services separately
                </ButtonLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---- the money questions ----------------------------------------- */}
      <FaqSection
        items={moneyFaqs}
        id="pricing-questions"
        heading="What people ask before they pay"
        lede="The money and rights questions, answered as they are on a call."
        grouped
        footerLink={{ href: '/faq', label: 'All fourteen questions and answers' }}
      />
    </>
  )
}
