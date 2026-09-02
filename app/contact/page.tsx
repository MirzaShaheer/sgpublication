import type { Metadata } from 'next'

import { ContactForm } from '@/components/lead/ContactForm'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { Seal } from '@/components/brand/Seal'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { absoluteUrl, site } from '@/lib/site'

/**
 * The contact page.
 *
 * The form is the page, so nothing competes with it: no testimonial rail, no
 * package prices, no second call to action. The only other matter here answers
 * the two questions someone hovering over a send button actually has, which
 * are what happens after they press it and whether they can talk to a person
 * instead.
 *
 * The lead overlays are suppressed on this route by LeadProvider, so a visitor
 * already looking at a form is never interrupted by a popup asking them to
 * fill in a shorter one.
 */

const title = 'Book a free call'
const description =
  'Tell us where your book is and an editor replies within one working day with an honest read on it: whether it will sell, what it would cost, and how long it would take. Free, and nothing is charged until you have seen the plan in writing.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/contact') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/contact'),
  },
}

/** What actually happens after the button is pressed, in order. */
const afterYouSend = [
  {
    marker: 'Within a day',
    text: 'An editor reads what you wrote. Not a salesperson, and not an autoresponder. You get a reply by email, usually the same working day and always within one.',
  },
  {
    marker: 'The reply',
    text: 'An honest read on the book: whether we think there is a market for it, which of the three packages fits, and roughly what it would cost. If we think you do not need us, the reply says that instead.',
  },
  {
    marker: 'If you want one',
    text: 'A thirty minute call, at a time you pick. You talk, we take notes. Nothing is charged and nothing is committed until you have a written plan in front of you.',
  },
]

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />

      <Section size="lg" labelledBy="contact-title">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-20">
            <div>
              <Seal size={58} />
              <p className="marker mt-7 text-gold-ink">Contact</p>
              <h1 id="contact-title" className="mt-4 max-w-[16ch] text-hero">
                Start with a conversation
              </h1>
              <p className="measure mt-6 text-lead text-ink-soft">
                There is no charge for the first call and no obligation at the
                end of it. Most of the people who write to us have never
                published anything, and that is who this is for.
              </p>

              <hr className="rule-gold mt-10" aria-hidden="true" />

              <h2 className="marker mt-6 text-gold-ink">After you send it</h2>
              <dl className="mt-4">
                {afterYouSend.map((step) => (
                  <div key={step.marker}>
                    <hr className="rule-quiet" aria-hidden="true" />
                    <div className="py-4">
                      <dt className="marker text-ink">{step.marker}</dt>
                      <dd className="measure mt-2 text-small text-ink-soft">
                        {step.text}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <hr className="rule-quiet" aria-hidden="true" />

              {/* PLACEHOLDER contact details, from lib/site.ts. */}
              <p className="mt-7 text-small text-ink-soft">
                Would rather just talk?{' '}
                <a className="link" href={`tel:${site.phoneHref}`}>
                  {site.phone}
                </a>{' '}
                or{' '}
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            </div>

            <div className="lg:pt-3">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>

      {/*
        The scheduling embed goes here.

        A styled placeholder rather than a live third party script: adding
        Calendly or SavvyCal loads their JavaScript on this route, puts a
        third party in the critical path and adds a cookie surface, and that
        is the client's decision rather than ours.

        TO ENABLE: replace the block below with the provider's iframe. Give it
        a title attribute, set loading="lazy", and check that the page still
        answers the three questions above with the iframe blocked.
      */}
      <Section tone="paper-2" ruled labelledBy="schedule-title">
        <Container>
          <div className="measure-wide">
            <h2 id="schedule-title" className="text-h3">
              Prefer to pick a slot yourself?
            </h2>
            <p className="mt-4 text-ink-soft">
              Send the form and the reply carries a link to an editor&rsquo;s
              calendar, so you choose the time rather than being offered one.
              We have deliberately not embedded a booking widget on this page:
              it would load a third party script and set cookies before you had
              agreed to anything.
            </p>
            <div className="mt-8 rounded-panel border border-dashed border-gold/60 px-6 py-10 text-center">
              <p className="marker text-gold-ink">Scheduling</p>
              <p className="measure mx-auto mt-3 text-small text-ink-soft">
                A calendar link is sent with the reply, usually within one
                working day.
              </p>
              <p className="mt-6">
                <ButtonLink href="#contact-title" variant="secondary">
                  Back to the form
                </ButtonLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
