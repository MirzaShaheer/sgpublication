import type { Metadata } from 'next'

import { JourneyObject } from '@/components/home/JourneyObject'
import { StageStrip } from '@/components/home/StageStrip'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { journey, journeyCopy } from '@/content/journey'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * The six stages, at full length and standing still.
 *
 * The home page spends one of the site's two motion moments on this same
 * material, turning it into a scroll driven sequence. This page deliberately
 * does not: someone who has navigated here wants to read the whole thing,
 * compare stage four with stage two, and print it or send it to a spouse.
 * So every stage is open, in order, with both work columns visible at once
 * and nothing revealed on scroll.
 *
 * Naming what the AUTHOR does at each stage is the point. Most publishers
 * hide it, an author signs, and then discovers in month three that they owe
 * forty hours of interviews.
 */

const title = 'How it works, the six stages of making a book'
const description =
  'The six stages we take a book through, what we do at each one, what you have to do, and how long each honestly takes. From a first call to a book that keeps selling.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/how-it-works') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/how-it-works'),
  },
}

/** The two things that actually move a schedule, said before anyone asks. */
const schedule = [
  {
    heading: 'What makes it faster',
    points: [
      'Reading each batch of chapters within a week. This alone finishes books months earlier.',
      'Having your material in one place before stage one: talks, notes, half written posts, the stories you already tell.',
      'Deciding once. A cover reopened in week nine costs more than the revision itself.',
    ],
  },
  {
    heading: 'What makes it slower',
    points: [
      'A manuscript needing a structural rewrite rather than an edit. We say so at the outline stage, not at the end.',
      'Interviews rescheduled repeatedly. The writing runs on them, so a missed week is a missed week of drafting.',
      'Adding scope mid project. All possible, all quoted in writing before the work starts.',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'How it works', href: '/how-it-works' },
        ]}
      />

      {/* ---- opening ---------------------------------------------------- */}
      <Section size="lg" labelledBy="how-title">
        <Container>
          <p className="marker text-gold-ink">How it works</p>
          <h1 id="how-title" className="mt-5 max-w-[18ch] text-hero">
            {journeyCopy.heading}
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            {journeyCopy.lede}
          </p>
          <p className="measure-wide mt-5 text-ink-soft">
            Every stage names both halves of the work. The right hand column is
            the one most publishers leave out of the brochure.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <ButtonLink href={contactHref} size="lg">
              {journeyCopy.cta.label}
            </ButtonLink>
            <ButtonLink href="/packages" variant="quiet">
              What each stage costs
            </ButtonLink>
          </div>

          {/* The whole arc before any of it is read, and the contents for the
              six full stages below. */}
          <StageStrip />
        </Container>
      </Section>

      {/* ---- the six stages --------------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="stages-title">
        <Container>
          <h2 id="stages-title" className="sr-only">
            The six stages
          </h2>

          <ol>
            {journey.map((stage, index) => (
              <li key={stage.id} id={stage.id}>
                {index > 0 ? <hr className="rule-quiet" aria-hidden="true" /> : null}

                <article className="grid gap-x-12 gap-y-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
                  {/* Stage marker, timeframe, and the object at this stage. */}
                  <div>
                    <p className="marker text-gold-ink">Stage {stage.index}</p>
                    <h3 className="mt-3 text-h3">{stage.name}</h3>
                    <p className="mt-4 text-fine text-ink-soft">
                      {stage.timeframe}
                    </p>

                    <div
                      aria-hidden="true"
                      className="mt-8 hidden w-full max-w-[11rem] lg:block"
                    >
                      {/* All six are on the page at once, so each needs its
                          own id namespace for the gradients inside it. */}
                      <JourneyObject
                        state={stage.objectState}
                        still
                        idSuffix={stage.id}
                      />
                    </div>
                    <p className="mt-4 hidden text-fine text-ink-soft lg:block">
                      {stage.objectCaption}
                    </p>
                  </div>

                  <div>
                    <p className="measure-wide text-lead">{stage.summary}</p>

                    <div className="mt-9 grid gap-9 sm:grid-cols-2 sm:gap-12">
                      <div>
                        <hr className="rule-gold" aria-hidden="true" />
                        <h4 className="marker mt-3 text-gold-ink">What we do</h4>
                        <ul className="mt-3">
                          {stage.sgDoes.map((item, itemIndex) => (
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
                      </div>

                      {/* The half nobody else prints. */}
                      <div>
                        <hr className="rule-gold" aria-hidden="true" />
                        <h4 className="marker mt-3 text-olive-ink">
                          What you do
                        </h4>
                        <ul className="mt-3">
                          {stage.authorDoes.map((item, itemIndex) => (
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
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          <hr className="rule-quiet" aria-hidden="true" />
        </Container>
      </Section>

      {/* ---- the schedule, honestly -------------------------------------- */}
      <Section ruled labelledBy="schedule-title">
        <Container>
          <h2 id="schedule-title" className="max-w-[20ch] text-h2">
            What actually changes the timeline
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            Two things decide which end of each range you land on, and only one
            of them is ours.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-16">
            {schedule.map((column) => (
              <div key={column.heading}>
                <hr className="rule-gold" aria-hidden="true" />
                <h3 className="marker mt-3 text-gold-ink">{column.heading}</h3>
                <ul className="mt-3">
                  {column.points.map((point, index) => (
                    <li key={point}>
                      {index > 0 ? (
                        <hr className="rule-quiet" aria-hidden="true" />
                      ) : null}
                      <p className="py-4 text-small text-ink-soft">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <ButtonLink href={contactHref} size="lg">
              Start at stage one
            </ButtonLink>
            <ButtonLink href="/published" variant="quiet">
              See books that went through it
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
