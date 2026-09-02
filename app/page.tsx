import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { ProblemQuotes } from '@/components/home/ProblemQuotes'
import { WhatWeDo } from '@/components/home/WhatWeDo'
import { AuthorJourney } from '@/components/home/AuthorJourney'
import { PackagesSection } from '@/components/home/PackagesSection'
import { PublishedGrid } from '@/components/home/PublishedGrid'
import { FeaturedTestimonial } from '@/components/home/FeaturedTestimonial'
import { WhySG } from '@/components/home/WhySG'
import { FaqSection } from '@/components/home/FaqSection'
import { ClosingCta } from '@/components/home/ClosingCta'
import { InlineLeadForm } from '@/components/lead/InlineLeadForm'
import { Section } from '@/components/ui/Section'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { absoluteUrl, site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'SG Publication, book publishing for first time authors',
  description:
    'We take first time authors from a raw idea to a published book: ghostwriting, editing, cover design, publishing to every major store, launch marketing and ongoing management. You keep 100 percent of your royalties.',
  alternates: { canonical: absoluteUrl('/') },
  openGraph: {
    title: 'SG Publication, book publishing for first time authors',
    description: site.description,
    url: absoluteUrl('/'),
  },
}

export default function HomePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'Home', href: '/' }]} />
      <Hero />
      <ProblemQuotes />
      <WhatWeDo />
      <AuthorJourney />
      <Section tone="paper-2" size="md" id="talk-to-us">
        <InlineLeadForm source="inline" />
      </Section>
      <PackagesSection />
      <PublishedGrid />
      <FeaturedTestimonial />
      <WhySG />
      <FaqSection />
      <ClosingCta />
    </>
  )
}
