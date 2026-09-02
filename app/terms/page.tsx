import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { Container, Section } from '@/components/ui/Section'
import { LegalDocument, type LegalSection } from '@/components/site/LegalDocument'
import { absoluteUrl, site } from '@/lib/site'

/**
 * Terms of service.
 *
 * PLACEHOLDER, AND NOT LEGAL ADVICE. These describe the terms the rest of the
 * site promises in plain language, which makes them a useful brief for a
 * lawyer, but they are not a substitute for one and they are not the project
 * contract. The binding terms of a book project are in the agreement an author
 * signs, which is a separate document.
 *
 * The "last updated" date is a fixed constant, not a computed one, so the
 * build output is deterministic. Change it by hand when the terms change.
 */

const LAST_UPDATED = '1 September 2026'

const title = 'Terms of service'
const description =
  'The terms covering use of this website and the basis on which SG Publication takes on work: who owns the copyright, how payment works, and what happens if a project stops.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/terms') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/terms'),
  },
}

const sections: LegalSection[] = [
  {
    heading: 'What these cover',
    blocks: [
      {
        kind: 'p',
        text: `These terms cover your use of this website and set out the basis on which ${site.legalName} takes on publishing work. They are not the contract for a book project. That is a separate written agreement signed by both sides before any work starts, and where the two differ, the signed agreement wins.`,
      },
    ],
  },
  {
    heading: 'Using this site',
    blocks: [
      {
        kind: 'p',
        text: 'You may read, print and share anything on this site. You may not copy its text or design wholesale to pass off as your own, and you may not submit forms automatically or at volume.',
      },
      {
        kind: 'p',
        text: 'The information here is offered in good faith and kept accurate as far as we can. Prices, timeframes and package contents shown on this site are indicative and are fixed only in a written quote.',
      },
    ],
  },
  {
    heading: 'Enquiries are not contracts',
    blocks: [
      {
        kind: 'p',
        text: 'Sending a form, booking a call or receiving a quote creates no obligation on either side. We may decline a project, and we do, most often when we think the market for a book is too small for the work to be worth your money. You may walk away at any point before signing.',
      },
    ],
  },
  {
    heading: 'You own your book',
    blocks: [
      {
        kind: 'p',
        text: 'Copyright in the finished text is yours from the first word. Where a ghostwriter is involved, they assign all rights to you in their contract with us and retain no claim on the manuscript.',
      },
      {
        kind: 'list',
        items: [
          'You own the copyright in the text, the cover artwork and the audiobook recording.',
          'You receive the source files: layout files, cover artwork at full resolution, and audio masters.',
          'ISBNs are registered in your name, and retail accounts are opened in your name with your bank and tax details.',
          'We keep no share of your royalties, at any tier, for any length of time.',
        ],
      },
      {
        kind: 'p',
        text: 'We ask only for the right to name you and show your book as work we have done. If you would rather we did not, say so and we will not.',
      },
    ],
  },
  {
    heading: 'What you are responsible for',
    blocks: [
      {
        kind: 'list',
        items: [
          'That the material you give us is yours to use, and that it does not infringe anyone else’s copyright.',
          'That statements of fact in your book are true, which matters most in memoir and in anything naming a real person.',
          'Reviewing and approving work at the sign off points in your project, and telling us plainly when something is wrong.',
          'Your own tax affairs on royalties, since the retail accounts and the money are yours.',
        ],
      },
    ],
  },
  {
    heading: 'Payment',
    blocks: [
      {
        kind: 'p',
        text: 'Payment is milestone based and tied to delivered work. The price is fixed at the point you sign, and nothing is added to it without your written approval first. We do not ask for the full amount up front.',
      },
      {
        kind: 'p',
        text: 'If a project stops partway, you pay for the milestones reached and you keep everything produced to that point, including the outline, the transcripts and any drafted chapters.',
      },
    ],
  },
  {
    heading: 'What we do not promise',
    blocks: [
      {
        kind: 'p',
        text: 'We do not guarantee sales, rankings, reviews or bestseller status, and we will not sign a contract that says otherwise. Anyone who guarantees a bestseller is either misleading you or planning to buy a ranking in a category small enough to be meaningless.',
      },
      {
        kind: 'p',
        text: 'We do not control the retailers. Store policies, category structures, pricing rules and advertising costs change, sometimes at short notice, and we can respond to those but not prevent them.',
      },
    ],
  },
  {
    heading: 'Liability',
    blocks: [
      {
        kind: 'p',
        text: 'Our liability in connection with a project is limited to the fees you have paid us for it. We are not liable for lost profits or lost sales. Nothing here limits liability for death, personal injury or fraud, which cannot be limited by agreement.',
      },
    ],
  },
  {
    heading: 'Governing law',
    blocks: [
      {
        kind: 'p',
        // PLACEHOLDER jurisdiction, keyed to the sample address in lib/site.ts.
        text: `These terms are governed by the laws of the State of ${site.address.region}, ${site.address.country}, and the courts there have exclusive jurisdiction. Confirm this with a lawyer before launch: it must match where the business is actually registered.`,
      },
    ],
  },
  {
    heading: 'Contacting us',
    blocks: [
      {
        kind: 'p',
        // PLACEHOLDER contact details, from lib/site.ts.
        text: `Email ${site.email} or write to ${site.legalName}, ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}.`,
      },
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Terms of service', href: '/terms' },
        ]}
      />
      <Section size="lg" labelledBy="terms-title">
        <Container>
          <LegalDocument
            id="terms-title"
            marker="Legal"
            title={title}
            lastUpdated={LAST_UPDATED}
            standfirst="Written in the same plain language as the rest of the site, because terms nobody can read are terms nobody agreed to."
            placeholderNote="Placeholder terms. They describe what the rest of this site promises and make a useful brief for a lawyer, but they have not been reviewed by one and they are not the project contract. Have them reviewed before launch."
            sections={sections}
          />
        </Container>
      </Section>
    </>
  )
}
