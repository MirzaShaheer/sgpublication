import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqSection } from '@/components/home/FaqSection'
import { QuoteForm } from '@/components/lead/QuoteForm'
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from '@/components/seo/JsonLd'
import {
  ServiceBlocks,
  blockHeadings,
  blockId,
} from '@/components/services/ServiceBlocks'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { getServicePage } from '@/content/service-pages'
import { getService, services } from '@/content/services'
import { journey } from '@/content/journey'
import { absoluteUrl, site } from '@/lib/site'

/**
 * One service, in full.
 *
 * Two content files meet here. content/services.ts carries the short copy that
 * the rest of the site also uses, and content/service-pages/<slug>.ts carries
 * the long copy that only exists here. Both are looked up by slug and either
 * one missing is a 404 rather than a half rendered page.
 *
 * Every one of these pages is statically generated, because there are seven of
 * them and they change about as often as a printed book does.
 */

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}

  const url = absoluteUrl(`/services/${service.slug}`)

  return {
    title: service.pageTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.pageTitle} | ${site.name}`,
      description: service.metaDescription,
      url,
    },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const service = getService(slug)
  const page = getServicePage(slug)

  // Both halves have to exist. A service listed with no long form page would
  // otherwise render as a title above nothing at all.
  if (!service || !page) notFound()

  const stageNumber = journey.findIndex((s) => s.name === service.stage) + 1
  const contents = blockHeadings(page.blocks)

  const related = page.relatedSlugs
    .map((relatedSlug) => getService(relatedSlug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
      />
      <ServiceJsonLd
        name={service.pageTitle}
        description={service.metaDescription}
        href={`/services/${service.slug}`}
        serviceType={service.intent}
      />
      <FaqJsonLd items={page.faqs} />

      {/* ---- title page --------------------------------------------------- */}
      <Section size="lg" labelledBy="service-title">
        <Container>
          <nav aria-label="Breadcrumb" className="text-small text-ink-soft">
            <Link className="link" href="/services">
              Services
            </Link>
            <span aria-hidden="true" className="px-2 text-paper-3">
              /
            </span>
            <span aria-current="page">{service.name}</span>
          </nav>

          <p className="marker mt-9 flex items-center gap-3 text-gold-ink">
            <ServiceIcon name={service.icon} size={20} className="text-gold" />
            {stageNumber > 0
              ? `Stage ${stageNumber}, ${service.stage}`
              : service.stage}
          </p>

          <h1 id="service-title" className="mt-5 max-w-[16ch] text-hero">
            {page.h1}
          </h1>

          <p className="measure-wide mt-7 text-lead text-ink-soft">
            {page.lede}
          </p>

          <dl className="mt-10 grid max-w-3xl gap-x-12 sm:grid-cols-2">
            <div className="border-t border-paper-3 py-4">
              <dt className="marker text-ink-soft">Typical timeframe</dt>
              <dd className="mt-2">{service.timeframe}</dd>
            </div>
            {page.priceFrom ? (
              <div className="border-t border-paper-3 py-4">
                <dt className="marker text-ink-soft">Price</dt>
                <dd className="mt-2">{page.priceFrom}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href="#quote" size="lg">
              Request a quote
            </ButtonLink>
            <ButtonLink href="/services" variant="quiet">
              Back to all services
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {/* ---- what is included, and the contents --------------------------- */}
      <Section tone="paper-2" ruled labelledBy="includes-title">
        <Container>
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
            <div>
              <h2 id="includes-title" className="max-w-[20ch] text-h2">
                What is included
              </h2>
              <p className="measure-wide mt-5 text-ink-soft">
                Everything below is part of this service. What is not included
                is named further down.
              </p>

              <ul className="mt-9">
                {service.includes.map((item, index) => (
                  <li key={item}>
                    {index > 0 ? (
                      <hr className="rule-quiet" aria-hidden="true" />
                    ) : null}
                    <p className="measure-wide py-3.5 text-ink-soft">{item}</p>
                  </li>
                ))}
              </ul>
              <hr className="rule-quiet" aria-hidden="true" />
            </div>

            {contents.length > 0 ? (
              <nav aria-labelledby="contents-title" className="lg:pt-2">
                <hr className="rule-gold" aria-hidden="true" />
                <h2 id="contents-title" className="marker mt-3 text-gold-ink">
                  On this page
                </h2>
                <ol className="mt-4 space-y-2.5">
                  {contents.map((heading) => (
                    <li key={heading}>
                      <a
                        className="text-small text-ink-soft underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-[text-decoration-color,color] duration-200 ease-page hover:text-ink hover:decoration-gold focus-visible:decoration-gold"
                        href={`#${blockId(heading)}`}
                      >
                        {heading}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      className="text-small text-ink-soft underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-[text-decoration-color,color] duration-200 ease-page hover:text-ink hover:decoration-gold focus-visible:decoration-gold"
                      href="#questions"
                    >
                      Questions and answers
                    </a>
                  </li>
                </ol>
              </nav>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* ---- the long form ------------------------------------------------ */}
      <Section ruled>
        <Container>
          <ServiceBlocks blocks={page.blocks} />
        </Container>
      </Section>

      {/* ---- questions ---------------------------------------------------- */}
      <FaqSection
        /* The accordion takes the sitewide `Faq` shape. These questions live
           with their service rather than in content/faqs.ts, so an id and a
           category are supplied here. The category is unused while `grouped`
           is false, and is set to the nearest real one rather than invented. */
        items={page.faqs.map((faq, index) => ({
          id: `${service.slug}-faq-${index}`,
          question: faq.question,
          answer: faq.answer,
          category: 'Process' as const,
        }))}
        heading={`Questions about ${service.name.toLowerCase()}`}
        lede="The ones that come up on nearly every call, answered the same way."
        tone="paper-2"
        footerLink={null}
      />

      {/* ---- the quote ask ------------------------------------------------ */}
      <Section id="quote" ruled labelledBy="quote-title">
        <Container>
          <QuoteForm
            serviceSlug={service.slug}
            heading={`Request a quote for ${service.name.toLowerCase()}`}
            lede="Tell us where the book is and we will send a written quote: a price, a timeframe, and what is not included."
          />
        </Container>
      </Section>

      {/* ---- what usually goes with this ---------------------------------- */}
      {related.length > 0 ? (
        <Section tone="dark" ruled labelledBy="related-title">
          <Container>
            <h2 id="related-title" className="max-w-[20ch] text-h2">
              What usually goes with this
            </h2>
            <p className="measure-wide mt-5 text-lead text-paper/80">
              Not an upsell. These are what this one depends on or leads into.
            </p>

            <ul className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <hr className="rule-quiet" aria-hidden="true" />
                  <Link
                    href={`/services/${entry.slug}`}
                    className="group flex gap-4 py-6"
                  >
                    <ServiceIcon
                      name={entry.icon}
                      className="mt-0.5 shrink-0 text-gold"
                    />
                    <span className="block">
                      <span className="block font-display text-h4 underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page group-hover:decoration-gold group-focus-visible:decoration-gold">
                        {entry.name}
                      </span>
                      <span className="mt-2 block text-small text-paper/72">
                        {entry.oneLiner}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <hr className="rule-quiet" aria-hidden="true" />

            <p className="mt-10">
              <ButtonLink href="/services" variant="quiet">
                See all seven services
              </ButtonLink>
            </p>
          </Container>
        </Section>
      ) : null}
    </>
  )
}
