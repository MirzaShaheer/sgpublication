import type { Metadata } from 'next'

import { FaqSection } from '@/components/home/FaqSection'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { faqs } from '@/content/faqs'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * All fourteen questions, grouped by category.
 *
 * The FAQPage graph is emitted here and only here. Google shows one FAQ rich
 * result per page and treats the same questions marked up on several pages as
 * duplication, so the home page renders its eight without structured data and
 * the canonical set is this one.
 *
 * Nothing on this page is truncated or hidden behind a "read more". The
 * uncomfortable answers, in particular the one about bestseller rankings, are
 * the most persuasive matter on the site and are allowed to run long.
 */

const title = 'Questions and answers'
const description =
  'What publishing a book costs, who keeps the royalties, whether ghostwriting is legitimate, how long it takes, and why nobody honest guarantees a bestseller. Fourteen questions answered plainly.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/faq') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/faq'),
  },
}

export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Questions and answers', href: '/faq' },
        ]}
      />
      <FaqJsonLd
        items={faqs.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))}
      />

      <Section size="lg" labelledBy="faq-title">
        <Container>
          <p className="marker text-gold-ink">Questions</p>
          <h1 id="faq-title" className="mt-5 max-w-[17ch] text-hero">
            The questions, including the awkward ones
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            These are answered here the way they are answered on a call, which
            is plainly, and with the parts that are not in our favour left in.
          </p>
          <p className="measure-wide mt-5 text-ink-soft">
            If something you need to know is not here, ask it on the call. An
            editor answers rather than a salesperson, and a company that will
            not answer a direct question directly is telling you something.
          </p>
        </Container>
      </Section>

      {/* Every question, under its category heading. */}
      <FaqSection
        items={faqs}
        id="all-questions"
        heading="Everything, by subject"
        lede=""
        grouped
        tone="paper-2"
        footerLink={null}
      />

      <Section tone="dark" ruled labelledBy="faq-cta-title">
        <Container>
          <div className="measure-wide">
            <h2 id="faq-cta-title" className="text-h2">
              Ask us the four questions
            </h2>
            <p className="mt-6 text-lead text-paper/80">
              Whose name the accounts and the ISBN are in. What percentage of
              royalties they take. The name and background of the editor who
              will actually work on your book. What happens after launch and
              whether it costs more. Ask them of us, and of everyone else you
              are considering, and get the answers in writing.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink href={contactHref} variant="primary-on-dark" size="lg">
                Book a free call
              </ButtonLink>
              <ButtonLink href="/packages" variant="quiet">
                See what it costs
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
