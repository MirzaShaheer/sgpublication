import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { Seal } from '@/components/brand/Seal'
import { ButtonLink } from '@/components/ui/Button'
import { Plate } from '@/components/ui/Plate'
import { Container, Section } from '@/components/ui/Section'
import { packageGuarantees } from '@/content/packages'
import { testimonials } from '@/content/testimonials'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * About.
 *
 * An about page on a publishing site is a trust page, so this one is written
 * as evidence rather than as a story: what we commit to, how we are paid, what
 * we will not do, and the authors who can be asked. There is no stock team
 * photograph and no founder origin myth.
 *
 * The #authors section is linked from the testimonial band on the home page,
 * so that id is load bearing. Do not rename it without updating
 * components/home/FeaturedTestimonial.tsx.
 *
 * PLACEHOLDER: the roles below describe the shape of the team rather than
 * naming real people, because no team content has been supplied. Replace with
 * real names, photographs and backgrounds before launch, and keep the format:
 * a named person with a checkable background beats a headcount.
 */

const title = 'About SG Publication'
const description =
  'A full service publishing house for first time authors. Who we are, how we are paid, what we commit to in writing, and the things we will not do.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/about') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/about'),
  },
}

/** What we will not do, which is the more useful half of a positioning page. */
const refusals = [
  {
    heading: 'We do not take a percentage',
    text: 'We are paid once, for the work. No royalty share, and no "partnership" that is really a cut of every sale.',
  },
  {
    heading: 'We do not hold your accounts',
    text: 'Amazon KDP, IngramSpark, Audible and the rest are registered in your name. Revoke our access tomorrow and the book keeps selling.',
  },
  {
    heading: 'We do not guarantee a bestseller',
    text: 'Anyone who does is misleading you, or planning to buy a ranking in a category too small to mean anything.',
  },
  {
    heading: 'We do not buy reviews',
    text: 'Reviews come through legitimate reader programmes. Paid reviews breach every retailer’s terms and get books delisted.',
  },
  {
    heading: 'We do not bill surprises',
    text: 'The price is fixed when you sign. Anything outside the package is quoted in writing before the work starts.',
  },
  {
    heading: 'We do not take every book',
    text: 'If the market for yours is very small, or you do not need us, the first reply says so.',
  },
]

/** PLACEHOLDER team. Roles, not invented biographies. */
const team = [
  {
    role: 'Editorial',
    text: 'Developmental and line editors, several with Big Five backgrounds. You get the name and background of yours before you sign, and they stay to the end.',
  },
  {
    role: 'Writing',
    text: 'Ghostwriters who work from recorded interviews, matched to a subject rather than assigned by availability. If the voice is wrong we change the writer at no cost.',
  },
  {
    role: 'Design and production',
    text: 'Cover designers and typesetters who set for print and reflow for ebook. Covers are designed for how they read as a thumbnail, because that is where the buying decision happens.',
  },
  {
    role: 'Publishing and marketing',
    text: 'The people who register the ISBNs, open the accounts in your name, test the listing, run the advertising, and send a plain language royalty report each month.',
  },
]

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />

      {/* ---- opening ---------------------------------------------------- */}
      <Section size="lg" labelledBy="about-title">
        <Container>
          <Seal size={64} />
          <p className="marker mt-7 text-gold-ink">About</p>
          <h1 id="about-title" className="mt-4 max-w-[18ch] text-hero">
            A publishing house for people who have never published
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            {site.name} has taken more than four hundred authors from a first
            call to a book on sale since {site.founded}. Almost none of them had
            written a book before, and most arrived having been quoted a number
            by someone who would not explain what was in it.
          </p>
          <p className="measure-wide mt-5 text-ink-soft">
            The business is arranged around that. We are paid for work rather
            than a share of your sales, every account is in your name, and
            everything is written down before you pay. That is not generosity:
            it is what lets a first time author tell whether they are being
            dealt with straight.
          </p>
        </Container>
      </Section>

      {/* ---- the three commitments --------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="commitments-title">
        <Container>
          <h2 id="commitments-title" className="max-w-[20ch] text-h2">
            Three things that never change
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            They apply to the cheapest package and the most expensive one
            equally, and they are in every contract we send.
          </p>
          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            {packageGuarantees.map((guarantee) => (
              <li key={guarantee}>
                <hr className="rule-gold" aria-hidden="true" />
                <p className="mt-4 font-display text-h3">{guarantee}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---- what we will not do ----------------------------------------- */}
      <Section ruled labelledBy="refusals-title">
        <Container>
          <h2 id="refusals-title" className="max-w-[20ch] text-h2">
            What we will not do
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            A list of promises tells you very little, because everyone makes the
            same ones. This is the more useful half.
          </p>

          <dl className="mt-10 grid gap-x-14 gap-y-0 sm:grid-cols-2">
            {refusals.map((item) => (
              <div key={item.heading}>
                <hr className="rule-quiet" aria-hidden="true" />
                <div className="py-6">
                  <dt className="font-display text-h4">{item.heading}</dt>
                  <dd className="measure mt-2.5 text-small text-ink-soft">
                    {item.text}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
          <hr className="rule-quiet" aria-hidden="true" />
        </Container>
      </Section>

      {/* ---- the team ----------------------------------------------------- */}
      <Section tone="paper-2" ruled labelledBy="team-title">
        <Container>
          <h2 id="team-title" className="max-w-[20ch] text-h2">
            Who you would be working with
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            You meet the people on your book before you sign, with their names
            and backgrounds. Not a team size, not a stock photograph.
          </p>
          {/* PLACEHOLDER, see the note at the head of this file. */}
          <p className="measure mt-4 text-small text-gold-ink">
            Named profiles and photographs are added before launch. The four
            below describe how the work is divided.
          </p>

          {/* Four plates rather than four rows of prose: the section is about
              who these people are, and that is a thing to be shown. Each Plate
              draws itself until a photograph exists, so adding one later is a
              src prop and nothing moves. */}
          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li key={member.role}>
                <Plate
                  ratio="4 / 5"
                  label={member.role}
                  sizes="(min-width: 1024px) 21vw, (min-width: 640px) 44vw, 84vw"
                />
                <hr className="rule-gold mt-5" aria-hidden="true" />
                <h3 className="marker mt-3 text-gold-ink">{member.role}</h3>
                <p className="mt-2.5 text-small text-ink-soft">{member.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---- the authors. Linked from the home page testimonial band. ----- */}
      <Section id="authors" ruled labelledBy="authors-title">
        <Container>
          <h2 id="authors-title" className="max-w-[20ch] text-h2">
            What our authors said
          </h2>
          <p className="measure mt-5 text-lead text-ink-soft">
            Each of these named a specific fear before they signed. That is what
            we asked them about afterwards.
          </p>
          {/* PLACEHOLDER testimonials, from content/testimonials.ts. */}
          <p className="measure mt-4 text-small text-gold-ink">
            Sample testimonials shown. Replace with real, permissioned quotes
            before launch.
          </p>

          <ul className="mt-12 grid gap-x-14 gap-y-12 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id}>
                <figure>
                  <hr className="rule-gold" aria-hidden="true" />
                  <blockquote className="mt-6">
                    {testimonial.quote.map((sentence, index) => (
                      <p
                        key={sentence.slice(0, 24)}
                        className={
                          index === 0
                            ? 'measure font-display text-h4'
                            : 'measure mt-3 font-display text-h4'
                        }
                      >
                        {index === 0 ? '“' : null}
                        {sentence}
                        {index === testimonial.quote.length - 1
                          ? '”'
                          : null}
                      </p>
                    ))}
                  </blockquote>

                  <figcaption className="mt-6 flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control border border-gold bg-paper-3 font-display text-gold-ink"
                    >
                      {testimonial.initials}
                    </span>
                    <span className="block">
                      <span className="block font-display text-h4">
                        {testimonial.name}
                      </span>
                      <span className="mt-1 block text-fine text-ink-soft">
                        {testimonial.role}
                      </span>
                      <span className="mt-1 block text-fine text-ink-soft">
                        <cite className="font-display italic">
                          {testimonial.bookTitle}
                        </cite>
                        {' · '}
                        {testimonial.bookGenre}
                      </span>
                      <span className="mt-2.5 block text-fine text-gold-ink">
                        {testimonial.result}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* ---- close -------------------------------------------------------- */}
      <Section tone="dark" ruled labelledBy="about-cta-title">
        <Container>
          <div className="measure-wide">
            <h2 id="about-cta-title" className="text-h2">
              Ask us anything on the list
            </h2>
            <p className="mt-6 text-lead text-paper/80">
              Thirty minutes, free. You come away with an honest read on whether
              the book is worth writing, what it would cost, and how long it
              would take.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink href={contactHref} variant="primary-on-dark" size="lg">
                Book a free call
              </ButtonLink>
              <ButtonLink href="/published" variant="quiet">
                See what we have published
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
