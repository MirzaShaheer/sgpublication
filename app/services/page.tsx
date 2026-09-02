import type { Metadata } from 'next'
import Link from 'next/link'

import { QuoteForm } from '@/components/lead/QuoteForm'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { packageGuarantees } from '@/content/packages'
import { getServicePage } from '@/content/service-pages'
import { services } from '@/content/services'
import { journey } from '@/content/journey'
import { absoluteUrl, site } from '@/lib/site'

/**
 * The services index.
 *
 * This page exists to answer one question: what is actually in each of these,
 * and what does it cost. So every service is set out in full here rather than
 * teased, with its deliverables, its timeframe and its starting price on the
 * page, and the link into the long form page is an invitation rather than a
 * requirement. A visitor who reads only this page should be able to decide.
 *
 * The starting prices are read from the long form pages through
 * `getServicePage`, so a price is written once in one content file and cannot
 * drift between the index and the page it summarises.
 */

const title = 'Publishing services, and exactly what each one includes'
const description =
  'Ghostwriting, editing, cover design, publishing and distribution, audiobook production, book marketing and author websites. What is in each service, how long it takes, what it costs, and what you have to do.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/services') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/services'),
  },
}

/** The six stages, in the order the journey runs, for grouping the index. */
const stageOrder = journey.map((stage) => stage.name)

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
        ]}
      />

      {/* ---- opening ---------------------------------------------------- */}
      <Section size="lg" labelledBy="services-title">
        <Container>
          <p className="marker text-gold-ink">Services</p>
          <h1 id="services-title" className="mt-5 max-w-[18ch] text-hero">
            What each service actually includes
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            Seven services. Each says what you get, how long it takes and what
            it costs. Take a whole package, or the one piece you are missing.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="#quote" size="lg">
              Request a quote
            </ButtonLink>
            <ButtonLink href="/packages" variant="quiet">
              Or see the three packages
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ---- the seven, in full ----------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="all-services-title">
        <Container>
          {/* The h1 above already names this section in the reader's own words,
              so the heading is present for the outline and not repeated on the
              page. */}
          <h2 id="all-services-title" className="sr-only">
            Every service, in full
          </h2>

          <ul>
            {services.map((service, index) => {
              const page = getServicePage(service.slug)
              const stageNumber = stageOrder.indexOf(service.stage) + 1

              return (
                <li key={service.slug}>
                  {index > 0 ? (
                    <hr className="rule-quiet" aria-hidden="true" />
                  ) : null}

                  <article className="grid gap-x-12 gap-y-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
                    <div>
                      <p className="marker text-gold-ink">
                        {stageNumber > 0
                          ? `Stage ${stageNumber}, ${service.stage}`
                          : service.stage}
                      </p>

                      <h3 className="mt-4 flex items-start gap-4 text-h3">
                        <ServiceIcon
                          name={service.icon}
                          className="mt-1 shrink-0 text-gold"
                        />
                        <Link
                          href={`/services/${service.slug}`}
                          className="underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page hover:decoration-gold focus-visible:decoration-gold"
                        >
                          {service.name}
                        </Link>
                      </h3>

                      <p className="measure mt-4 text-ink-soft">
                        {service.oneLiner}
                      </p>

                      <dl className="mt-7 text-small">
                        <div className="flex gap-3 border-t border-paper-3 py-2.5">
                          <dt className="marker w-24 shrink-0 pt-1 text-ink-soft">
                            Takes
                          </dt>
                          <dd className="text-ink">{service.timeframe}</dd>
                        </div>
                        {page?.priceFrom ? (
                          <div className="flex gap-3 border-t border-paper-3 py-2.5">
                            <dt className="marker w-24 shrink-0 pt-1 text-ink-soft">
                              Price
                            </dt>
                            <dd className="text-ink">{page.priceFrom}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>

                    <div>
                      <hr className="rule-gold" aria-hidden="true" />
                      <h4 className="marker mt-3 text-gold-ink">
                        What is included
                      </h4>
                      <ul className="mt-3">
                        {service.includes.map((item, itemIndex) => (
                          <li key={item}>
                            {itemIndex > 0 ? (
                              <hr className="rule-quiet" aria-hidden="true" />
                            ) : null}
                            <p className="py-3 text-small text-ink-soft">
                              {item}
                            </p>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <ButtonLink
                          href={`/services/${service.slug}`}
                          variant="secondary"
                        >
                          Read the full page
                        </ButtonLink>
                        <ButtonLink
                          href={`/services/${service.slug}#quote`}
                          variant="quiet"
                        >
                          Request a quote for this
                        </ButtonLink>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>

          <hr className="rule-quiet" aria-hidden="true" />
        </Container>
      </Section>

      {/* ---- how they fit together -------------------------------------- */}
      <Section ruled labelledBy="combining-title">
        <Container>
          <h2 id="combining-title" className="max-w-[20ch] text-h2">
            You do not have to take all of it
          </h2>
          <div className="measure-wide mt-6">
            <p className="text-ink-soft">
              Most authors need three or four of these, not seven. A finished
              manuscript needs editing, a cover and publishing. A book on sale
              and not moving usually needs a new cover and some marketing.
            </p>
            <p className="mt-5 text-ink-soft">
              Those combinations repeat, which is why the packages exist and
              why they cost less than the same pieces bought one at a time.
            </p>
          </div>

          {/* The three house terms, carried whatever you take. Set as three
              ruled lines rather than as a third paragraph: it is a list of
              facts and it was being read as prose. */}
          <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-3">
            {packageGuarantees.map((guarantee) => (
              <li key={guarantee}>
                <hr className="rule-gold" aria-hidden="true" />
                <p className="mt-3 font-display text-h4">{guarantee}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="/packages" variant="secondary">
              Compare the three packages
            </ButtonLink>
            <ButtonLink href="/how-it-works" variant="quiet">
              See the six stages of a book
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ---- the quote ask ---------------------------------------------- */}
      <Section id="quote" tone="paper-2" ruled labelledBy="quote-title">
        <Container>
          <QuoteForm />
        </Container>
      </Section>
    </>
  )
}
