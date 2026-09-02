import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { getPost, posts, type PostBlock } from '@/content/posts'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * One post.
 *
 * The body is a small typed block union rather than markdown, so no parser
 * ships and every kind of block is styled deliberately. The measure is capped
 * at the site's reading width; a post is the one place on this site that is
 * pure running text, and running text past 72 characters a line is where
 * people stop.
 */

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
    openGraph: {
      type: 'article',
      title: `${post.metaTitle} | ${site.name}`,
      description: post.metaDescription,
      url: absoluteUrl(`/blog/${post.slug}`),
    },
  }
}

function Block({ block }: { block: PostBlock }) {
  if (block.kind === 'h2') {
    return <h2 className="mt-12 text-h3">{block.text}</h2>
  }

  if (block.kind === 'list') {
    return (
      <ul className="mt-6">
        {block.items.map((item, index) => (
          <li key={item}>
            {index > 0 ? <hr className="rule-quiet" aria-hidden="true" /> : null}
            <div className="flex gap-4 py-3">
              <span
                aria-hidden="true"
                className="mt-[0.72rem] h-px w-3 shrink-0 bg-gold"
              />
              <p className="text-ink-soft">{item}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  /* An aside, ruled in gold and hung into the gutter the way a printed margin
     note sits beside the column it belongs to. */
  if (block.kind === 'note') {
    return (
      <aside className="mt-8 border-l border-gold pl-5 sm:-ml-5">
        <p className="font-display text-h4">{block.text}</p>
      </aside>
    )
  }

  return <p className="mt-6 text-ink-soft">{block.text}</p>
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = posts.filter((other) => other.slug !== post.slug)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Notes', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <Section size="lg" labelledBy="post-title">
        <Container>
          <div className="measure-wide">
            <p className="marker text-gold-ink">
              {post.date}
              <span className="text-ink-soft">
                {' · '}
                {post.readingMinutes} minute read
              </span>
            </p>
            <h1 id="post-title" className="mt-5 text-h2">
              {post.title}
            </h1>
            <p className="mt-6 text-lead text-ink-soft">{post.standfirst}</p>

            <hr className="rule-pair mt-10" aria-hidden="true" />

            <div className="mt-10">
              {post.body.map((block, index) => (
                <Block key={`${block.kind}-${index}`} block={block} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper-2" ruled labelledBy="post-more-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div>
              <h2 id="post-more-title" className="text-h3">
                The other two
              </h2>
              <ul className="mt-6">
                {others.map((other) => (
                  <li key={other.slug}>
                    <hr className="rule-quiet" aria-hidden="true" />
                    <div className="py-5">
                      <h3 className="font-display text-h4">
                        <Link
                          href={`/blog/${other.slug}`}
                          className="underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page hover:decoration-gold focus-visible:decoration-gold"
                        >
                          {other.title}
                        </Link>
                      </h3>
                      <p className="measure mt-2 text-small text-ink-soft">
                        {other.standfirst}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <hr className="rule-quiet" aria-hidden="true" />
            </div>

            <div className="lg:pt-12">
              <hr className="rule-gold" aria-hidden="true" />
              <p className="marker mt-4 text-gold-ink">Your book</p>
              <p className="measure mt-3 text-small text-ink-soft">
                Thirty minutes with an editor, free, and an honest read on
                whether the book is worth writing and what it would cost.
              </p>
              <p className="mt-6">
                <ButtonLink href={contactHref}>Book a free call</ButtonLink>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
