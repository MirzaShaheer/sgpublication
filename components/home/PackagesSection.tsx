import { ButtonLink } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { contactHref } from '@/lib/site'
import { packageGuarantees, packages, packagesCopy } from '@/content/packages'

/**
 * Three tiers, set as three columns of a printed price list rather than as
 * three cards. There is no card primitive on this site, so the columns are
 * separated by the gold hairline above each one and by nothing else, and the
 * promoted tier is marked the way a printer marks a page: a heavier rule, a
 * small serif ribbon, and slightly more air. It is not scaled up, lifted on a
 * shadow, or filled with colour.
 *
 * PLACEHOLDER PRICING throughout. Every number here comes from content/
 * packages.ts and none of it has been confirmed. The visible note under the
 * prices says so, and stays until real numbers replace them.
 */
export function PackagesSection() {
  return (
    <Section id="packages" tone="paper-2" ruled labelledBy="packages-title">
      <Container>
        <SectionHeading
          id="packages-title"
          marker="Packages"
          title={packagesCopy.heading}
          lede={packagesCopy.lede}
        />

        <div className="mt-9 grid gap-x-10 gap-y-10 sm:mt-10 lg:grid-cols-3">
          {packages.map((tier) => (
            <div
              key={tier.slug}
              className={tier.promoted ? 'lg:-mt-4' : undefined}
            >
              <hr className={tier.promoted ? 'rule-gold' : 'rule-quiet'} />

              <div className="flex min-h-[1.5rem] items-baseline justify-between gap-4 pt-5">
                <p className="marker text-gold-ink">{tier.name}</p>
                {tier.ribbon ? (
                  <p className="marker text-ink-soft">{tier.ribbon}</p>
                ) : null}
              </div>

              {/* The price people pay leads. The full price sits beside it,
                  struck through, so the saving is visible without a second
                  line of explanation. A tier with no fullPriceLabel simply
                  renders the price on its own. */}
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

              <hr className="rule-quiet mt-6" />

              {tier.inherits ? (
                <p className="mt-5 font-display text-small italic">
                  Everything in {tier.inherits}, plus
                </p>
              ) : null}

              <ul className={tier.inherits ? 'mt-4 space-y-2.5' : 'mt-5 space-y-2.5'}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-small text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="mt-[0.62rem] h-px w-3 shrink-0 bg-gold"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

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

        {/* The three guarantees, carried beneath every tier without exception,
            so they read as terms of the house rather than as a feature of the
            expensive one. */}
        <div className="mt-10 sm:mt-12">
          <hr className="rule-gold" />
          <ul className="grid gap-x-10 gap-y-4 pt-6 sm:grid-cols-3">
            {packageGuarantees.map((guarantee) => (
              <li key={guarantee} className="font-display text-h4">
                {guarantee}
              </li>
            ))}
          </ul>
        </div>

        {/* The add ons list was removed with the new pricing: every figure on
            it was written against the old package prices and a $1,800 extra
            beside a $999 package reads as a mistake. Anything outside a
            package is quoted on the services pages instead. */}
        <div className="mt-9 sm:mt-10">
          <p className="measure text-small text-ink-soft">
            {packagesCopy.priceNote}
          </p>
          <p className="mt-6">
            <ButtonLink href="/services" variant="quiet">
              See what each service includes
            </ButtonLink>
          </p>
        </div>
      </Container>
    </Section>
  )
}
