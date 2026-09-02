import type { Metadata } from 'next'

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { Container, Section } from '@/components/ui/Section'
import { LegalDocument, type LegalSection } from '@/components/site/LegalDocument'
import { absoluteUrl, site } from '@/lib/site'

/**
 * Privacy policy.
 *
 * PLACEHOLDER, AND NOT LEGAL ADVICE. This describes what the site as built
 * actually does, which is a genuine starting point and is more accurate than
 * most generated policies, but it has not been reviewed by a lawyer and does
 * not cover the client's offline processing, their CRM, their email tooling or
 * their retention practice. Have it reviewed before launch.
 *
 * The "last updated" date is a fixed constant rather than a computed one, so
 * the build output is deterministic and the date means something. Change it by
 * hand when the policy changes.
 */

const LAST_UPDATED = '1 September 2026'

const title = 'Privacy policy'
const description =
  'What SG Publication collects when you use this site, why, how long it is kept, who it is shared with, and how to have it deleted.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/privacy') },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/privacy'),
  },
}

const sections: LegalSection[] = [
  {
    heading: 'Who we are',
    blocks: [
      {
        kind: 'p',
        text: `${site.legalName} is the data controller for the information described here. Our contact details are at the foot of every page and in the "How to reach us" section below.`,
      },
    ],
  },
  {
    heading: 'What we collect',
    blocks: [
      {
        kind: 'p',
        text: 'Only what you type into a form on this site, plus the small amount of technical context that arrives with it.',
      },
      {
        kind: 'list',
        items: [
          'What you enter: your name, email address, phone number and dialling country, the stage your book is at, its genre and approximate length, a budget range, and anything you write in the message field.',
          'What arrives with the request: the page you submitted from, the page that referred you to this site, your browser’s user agent string, and your IP address, which is used to rate limit submissions and is not stored with your enquiry.',
        ],
      },
      {
        kind: 'p',
        text: 'We do not ask for and have no use for payment details on this site. Nothing here processes a card.',
      },
    ],
  },
  {
    heading: 'Why we collect it',
    blocks: [
      {
        kind: 'p',
        text: 'To answer your enquiry, to send the publishing roadmap when you asked for it, and to arrange a call. That is the whole purpose. The lawful basis is your consent when you submit a form, and our legitimate interest in replying to someone who has contacted us about our services.',
      },
      {
        kind: 'p',
        text: 'We do not sell your details, we do not pass them to other companies for marketing, and submitting a form does not add you to a recurring newsletter.',
      },
    ],
  },
  {
    heading: 'Cookies and analytics',
    blocks: [
      {
        kind: 'p',
        text: 'This site sets no tracking cookies of its own. It stores three small values in your own browser to keep the lead prompts from becoming a nuisance: whether the timed prompt has been shown, whether you have already submitted a form, and whether the exit prompt has been shown this session. These never leave your device and are readable only by this site.',
      },
      {
        kind: 'p',
        text: 'A Google Tag Manager container may be enabled in future, in which case this section will name it and the cookies it sets before it goes live. No third party analytics script is loaded at the time of writing.',
      },
    ],
  },
  {
    heading: 'Who else sees it',
    blocks: [
      {
        kind: 'list',
        items: [
          'Our hosting provider, which runs the servers this site and its database sit on.',
          'Our email provider, in order to send you a reply.',
          'Nobody else, unless we are required to disclose something by law.',
        ],
      },
      {
        kind: 'p',
        text: 'Our providers process this data on our instructions and are not permitted to use it for their own purposes.',
      },
    ],
  },
  {
    heading: 'How long we keep it',
    blocks: [
      {
        kind: 'p',
        text: 'Enquiries that do not become projects are deleted after twenty four months. Records relating to work we carried out are kept for as long as we are required to keep business records, and then deleted.',
      },
    ],
  },
  {
    heading: 'Your rights',
    blocks: [
      {
        kind: 'p',
        text: 'You can ask us for a copy of what we hold about you, ask us to correct it, or ask us to delete it. Write to the email address below and we will act on it within thirty days. You do not have to explain why, and asking will not affect how we deal with you.',
      },
      {
        kind: 'p',
        text: 'If you are in the UK or the EU and you think we have handled your data badly, you may complain to your national supervisory authority. We would rather you told us first.',
      },
    ],
  },
  {
    heading: 'How to reach us',
    blocks: [
      {
        kind: 'p',
        // PLACEHOLDER contact details, from lib/site.ts.
        text: `Email ${site.email} or write to ${site.legalName}, ${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}, ${site.address.country}.`,
      },
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Privacy policy', href: '/privacy' },
        ]}
      />
      <Section size="lg" labelledBy="privacy-title">
        <Container>
          <LegalDocument
            id="privacy-title"
            marker="Legal"
            title={title}
            lastUpdated={LAST_UPDATED}
            standfirst="This describes what this website does with what you type into it. It is written to be read rather than to be survived."
            placeholderNote="Placeholder policy. It reflects how the site is built, but it has not been reviewed by a lawyer and does not yet cover processing that happens away from this website. Have it reviewed before launch."
            sections={sections}
          />
        </Container>
      </Section>
    </>
  )
}
