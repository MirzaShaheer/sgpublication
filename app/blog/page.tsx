import type { Metadata } from 'next'
import Link from 'next/link'

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { posts } from '@/content/posts'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * The writing and publishing notes index.
 *
 * Set as a contents page rather than as a grid of cards: title, one line, and
 * how long it takes to read. There is no excerpt with a "read more" cut mid
 * sentence, because a truncated paragraph tells a reader less than one honest
 * sentence written for the purpose.
 */

const title = 'Writing and publishing notes'
const description =
  'Straight answers to the questions first time authors ask before they know publishing houses like ours exist: what a book costs, what an ISBN is, and whether to self publish.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/blog') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/blog'),
  },
}

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Writing and publishing notes', href: '/blog' },
        ]}
      />

      <Section size="lg" labelledBy="blog-title">
        <Container>
          <p className="marker text-gold-ink">Notes</p>
          <h1 id="blog-title" className="mt-5 max-w-[16ch] text-hero">
            {title}
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            Three questions we answer on nearly every first call, written out in
            full so you can read the answer without speaking to anyone. Nothing
            here is gated and nothing asks for your email halfway down.
          </p>
        </Container>
      </Section>

      <Section tone="paper-2" ruled labelledBy="posts-title">
        <Container>
          <h2 id="posts-title" className="sr-only">
            All notes
          </h2>

          <ul>
            {posts.map((post) => (
              <li key={post.slug}>
                <hr className="rule-quiet" aria-hidden="true" />
                <article className="grid gap-x-12 gap-y-4 py-9 sm:grid-cols-[10rem_minmax(0,1fr)] sm:py-11">
                  <div>
                    <p className="marker text-gold-ink">{post.date}</p>
                    <p className="mt-2 text-fine text-ink-soft">
                      {post.readingMinutes} minute read
                    </p>
                  </div>

                  <div>
                    <h3 className="text-h3">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page hover:decoration-gold focus-visible:decoration-gold"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="measure-wide mt-3 text-ink-soft">
                      {post.standfirst}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <hr className="rule-quiet" aria-hidden="true" />
        </Container>
      </Section>

      <Section tone="dark" ruled labelledBy="blog-cta-title">
        <Container>
          <div className="measure-wide">
            <h2 id="blog-cta-title" className="text-h2">
              Or just ask us
            </h2>
            <p className="mt-6 text-lead text-paper/80">
              The first call is thirty minutes, costs nothing, and an editor
              will answer any of this in your own situation rather than in
              general.
            </p>
            <p className="mt-10">
              <ButtonLink href={contactHref} variant="primary-on-dark" size="lg">
                Book a free call
              </ButtonLink>
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
