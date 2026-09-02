import type { ElementType } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { type Faq, faqCategories, homeFaqs } from '@/content/faqs'

/**
 * Questions and answers.
 *
 * A native details and summary accordion. No state, no client boundary, no
 * script: the browser already has this control, it is keyboard operable and
 * findable by in-page search, and a reader on a slow connection gets it before
 * anything else has loaded.
 *
 * The uncomfortable questions are the point of the section, so nothing here
 * truncates an answer or hides it behind a "read more". An honest answer about
 * what cannot be guaranteed is the most persuasive block on the page, and it is
 * allowed to run as long as it needs to.
 *
 * Items are separated by a quiet rule rather than boxed, and the open state is
 * marked by a gold hairline appearing down the left edge, hanging into the
 * gutter so no text shifts when an item opens. The disclosure indicator is a
 * gold plus whose vertical stroke collapses into a minus.
 */

type FaqSectionProps = {
  /** Defaults to the eight home page questions. Pass the full list on /faq. */
  items?: Faq[]
  heading?: string
  lede?: string
  id?: string
  /** 2 on a page whose h1 is the page title, 3 inside a subsection. */
  headingLevel?: 2 | 3
  /** Group the items under their category headings, for the /faq page. */
  grouped?: boolean
  ruled?: boolean
  tone?: 'paper' | 'paper-2'
  /** The quiet link under the list. Pass null where there is nowhere to go. */
  footerLink?: { href: string; label: string } | null
}

/* The plus. Its vertical stroke scales away on open, leaving the minus. Both
   strokes are the site hairline, so the control is drawn in the same weight as
   every rule around it. */
function Indicator() {
  // Nudged down so the plus sits on the optical centre of the question's first
  // line rather than on the top of its line box.
  return (
    <span
      aria-hidden="true"
      className="relative mt-[0.45rem] block h-3.5 w-3.5 shrink-0"
    >
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gold" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold transition-transform duration-200 ease-page group-open:scale-y-0" />
    </span>
  )
}

function FaqItem({
  faq,
  headingTag: Heading,
}: {
  faq: Faq
  headingTag: ElementType
}) {
  return (
    <li>
      <hr className="rule-quiet" aria-hidden="true" />
      {/* The gold edge hangs into the gutter, so opening an item changes the
          colour of a hairline and nothing on the page moves. */}
      <details
        className="group -ml-5 border-l border-transparent pl-5 transition-colors duration-200 ease-page open:border-gold sm:-ml-6 sm:pl-6"
      >
        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
          <Heading className="font-display text-h4 transition-colors duration-200 ease-page group-hover:text-gold-ink sm:text-h3">
            {faq.question}
          </Heading>
          <Indicator />
        </summary>

        <div className="measure pb-9">
          {faq.answer.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 24)}
              className={index === 0 ? 'text-ink-soft' : 'mt-5 text-ink-soft'}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </details>
    </li>
  )
}

export function FaqSection({
  items = homeFaqs,
  heading = 'Questions people ask before they sign',
  lede = 'Including the awkward ones, answered the way they are answered on a call.',
  id = 'questions',
  headingLevel = 2,
  grouped = false,
  ruled = true,
  tone = 'paper',
  footerLink = {
    href: '/faq',
    label: 'Read the rest of the questions and answers',
  },
}: FaqSectionProps = {}) {
  const headingId = `${id}-title`

  /* Heading levels are derived rather than hard coded so the component can drop
     one step down the outline on a page that already spends its h2. Grouping
     inserts the category heading between the section and the questions. */
  const tags: Record<number, ElementType> = {
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
  }
  const SectionHeadingTag = tags[headingLevel]
  const CategoryHeadingTag = tags[headingLevel + 1]
  const QuestionHeadingTag = tags[headingLevel + (grouped ? 2 : 1)]

  return (
    <Section id={id} tone={tone} ruled={ruled} labelledBy={headingId}>
      <Container>
        <SectionHeadingTag id={headingId} className="max-w-[20ch] text-h2">
          {heading}
        </SectionHeadingTag>
        {lede ? (
          <p className="measure mt-5 text-lead text-ink-soft">{lede}</p>
        ) : null}

        {grouped ? (
          <div className="mt-8 sm:mt-10">
            {faqCategories.map((category) => {
              const inCategory = items.filter(
                (faq) => faq.category === category,
              )
              if (inCategory.length === 0) return null

              return (
                <div key={category} className="mt-10 first:mt-0">
                  <CategoryHeadingTag className="marker text-gold-ink">
                    {category}
                  </CategoryHeadingTag>
                  <ul className="mt-6">
                    {inCategory.map((faq) => (
                      <FaqItem
                        key={faq.id}
                        faq={faq}
                        headingTag={QuestionHeadingTag}
                      />
                    ))}
                  </ul>
                  <hr className="rule-quiet" aria-hidden="true" />
                </div>
              )
            })}
          </div>
        ) : (
          <>
            <ul className="mt-8 sm:mt-10">
              {items.map((faq) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  headingTag={QuestionHeadingTag}
                />
              ))}
            </ul>
            <hr className="rule-quiet" aria-hidden="true" />
          </>
        )}

        {footerLink ? (
          <p className="mt-9">
            <ButtonLink href={footerLink.href} variant="quiet">
              {footerLink.label}
            </ButtonLink>
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
