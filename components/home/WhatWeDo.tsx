import Link from 'next/link'

import { ButtonLink } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import { services, servicesCopy } from '@/content/services'

/**
 * What we do.
 *
 * All seven services set as one continuous list, not as seven tiles. The list
 * flows down the first column and continues down the second, the way an index
 * runs in a printed book, and every entry is capped by a quiet hairline so the
 * two columns read as one run of matter. The whole entry is the link target;
 * the name alone carries the underline on hover.
 */

/* Rows are set explicitly so the list flows down before it flows across.
   Tailwind needs the class written out, so the count is mapped, not built. */
const rowClasses: Record<number, string> = {
  3: 'sm:grid-rows-3',
  4: 'sm:grid-rows-4',
  5: 'sm:grid-rows-5',
}

export function WhatWeDo() {
  const rows = rowClasses[Math.ceil(services.length / 2)] ?? 'sm:grid-rows-4'

  return (
    <Section id="what-we-do" ruled labelledBy="what-we-do-title">
      <Container>
        <SectionHeading
          id="what-we-do-title"
          title={servicesCopy.heading}
          lede={servicesCopy.lede}
        />

        <ul
          className={[
            'mt-8 grid grid-cols-1 gap-x-12 sm:mt-10 sm:grid-flow-col sm:grid-cols-2 lg:gap-x-20',
            rows,
          ].join(' ')}
        >
          {services.map((service) => (
            <li key={service.slug}>
              <hr className="rule-quiet" aria-hidden="true" />
              <Link
                href={`/services/${service.slug}`}
                className="group flex gap-4 py-5 sm:py-6"
              >
                <ServiceIcon
                  name={service.icon}
                  className="mt-0.5 shrink-0 text-gold"
                />
                <span className="block">
                  <span className="block font-display text-h4 underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page group-hover:decoration-gold group-focus-visible:decoration-gold">
                    {service.name}
                  </span>
                  <span className="measure mt-2 block text-small text-ink-soft">
                    {service.oneLiner}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="rule-quiet" aria-hidden="true" />

        <p className="mt-8">
          <ButtonLink href="/services" variant="quiet">
            Read what each service includes
          </ButtonLink>
        </p>
      </Container>
    </Section>
  )
}
