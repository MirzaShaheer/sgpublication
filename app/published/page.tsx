import type { Metadata } from 'next'

import { BookCard } from '@/components/home/BookCard'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Section'
import { books, genres, publishedCopy } from '@/content/books'
import { absoluteUrl, contactHref, site } from '@/lib/site'

/**
 * The portfolio.
 *
 * Grouped by genre rather than filtered by it. A filter needs JavaScript, hides
 * eleven twelfths of the work behind a control most visitors never touch, and
 * answers a question nobody asked; headed groups let someone scan for the shelf
 * their own book would sit on and see everything else on the way past.
 *
 * The jump links at the top are plain in page anchors, so they work with no
 * script and are the same mechanism a printed contents page uses.
 *
 * PLACEHOLDER PORTFOLIO. Every title, author, result and cover is invented.
 * The note at the head of the grid says so in visible copy, and it stays until
 * real, permissioned work replaces content/books.ts.
 */

const title = 'Books we have published'
const description =
  'A sample of the books SG Publication has taken from a first call to a title on sale: business, memoir, health, self help, faith and history, across all three packages.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/published') },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: absoluteUrl('/published'),
  },
}

/** A URL safe id per genre, used by the jump links and the group headings. */
const genreId = (genre: string) => `genre-${genre.toLowerCase().replace(/\s+/g, '-')}`

export default function PublishedPage() {
  const grouped = genres
    .map((genre) => ({
      genre,
      titles: books.filter((book) => book.genre === genre),
    }))
    .filter((group) => group.titles.length > 0)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Published books', href: '/published' },
        ]}
      />

      {/* ---- opening ---------------------------------------------------- */}
      <Section size="lg" labelledBy="published-title">
        <Container>
          <p className="marker text-gold-ink">Published</p>
          <h1 id="published-title" className="mt-5 max-w-[16ch] text-hero">
            {publishedCopy.heading}
          </h1>
          <p className="measure-wide mt-7 text-lead text-ink-soft">
            {publishedCopy.lede}
          </p>
          <p className="measure-wide mt-5 text-small text-gold-ink">
            {publishedCopy.placeholderNote}
          </p>

          {/* Contents, the way a book lists its parts. */}
          <nav aria-label="Jump to a genre" className="mt-10">
            <hr className="rule-gold" aria-hidden="true" />
            <ul className="flex flex-wrap gap-x-7 gap-y-2 pt-4">
              {grouped.map((group) => (
                <li key={group.genre}>
                  <a href={`#${genreId(group.genre)}`} className="nav-link">
                    {group.genre}
                    <span className="text-ink-soft"> ({group.titles.length})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* ---- the shelves ------------------------------------------------- */}
      {grouped.map((group, index) => (
        <Section
          key={group.genre}
          id={genreId(group.genre)}
          tone={index % 2 === 0 ? 'paper-2' : 'paper'}
          ruled={index > 0}
          labelledBy={`${genreId(group.genre)}-title`}
        >
          <Container>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 id={`${genreId(group.genre)}-title`} className="text-h2">
                {group.genre}
              </h2>
              <p className="marker text-ink-soft">
                {group.titles.length}{' '}
                {group.titles.length === 1 ? 'title' : 'titles'}
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10">
              {group.titles.map((book) => (
                <li key={book.slug}>
                  <BookCard book={book} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      {/* ---- close ------------------------------------------------------- */}
      <Section tone="dark" ruled labelledBy="published-cta-title">
        <Container>
          <div className="measure-wide">
            <h2 id="published-cta-title" className="text-h2">
              Yours would sit on one of these shelves
            </h2>
            <p className="mt-6 text-lead text-paper/80">
              Every book above started as a call with someone who had never
              published anything. Some arrived as a finished manuscript, some as
              a folder of talks, and one as a book already on sale that nobody
              was buying.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <ButtonLink href={contactHref} variant="primary-on-dark" size="lg">
                Book a free call
              </ButtonLink>
              <ButtonLink href="/how-it-works" variant="quiet">
                See how a book gets made
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
