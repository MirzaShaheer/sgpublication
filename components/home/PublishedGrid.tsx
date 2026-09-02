import Link from 'next/link'
import { GeneratedCover } from '@/components/brand/GeneratedCover'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { books, publishedCopy } from '@/content/books'

/**
 * The portfolio, set on the bark field so twelve covers read as a shelf rather
 * than as twelve tiles on paper. The covers carry themselves; there is no
 * plate, edge or shadow behind them, and the caption sits under each one the
 * way a plate is captioned in a printed book.
 *
 * PLACEHOLDER PORTFOLIO. Every title, author and result is invented and the
 * covers are drawn from the brand palette by <GeneratedCover>, not sourced.
 * The note under the grid says so in visible copy.
 */
export function PublishedGrid() {
  return (
    <Section id="published" tone="dark" ruled labelledBy="published-title">
      <Container>
        <SectionHeading
          id="published-title"
          marker="Published"
          title={publishedCopy.heading}
          lede={publishedCopy.lede}
        />

        <ul className="mt-9 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-10 sm:grid-cols-3 sm:gap-x-10 lg:grid-cols-4">
          {books.map((book) => (
            <li key={book.slug}>
              <Link href="/published" className="group block">
                <GeneratedCover
                  title={book.title}
                  author={book.author}
                  seed={book.slug}
                  archetype={book.archetype}
                  palette={book.palette}
                  className="block aspect-[1/1.5] w-full rounded-[2px] shadow-[0_14px_34px_-18px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-page group-hover:-translate-y-1"
                />
                <p className="mt-4 font-display text-h4 leading-snug underline decoration-transparent decoration-1 underline-offset-[0.22em] transition-[text-decoration-color] duration-200 ease-page group-hover:decoration-gold group-focus-visible:decoration-gold">
                  {book.title}
                </p>
                <p className="mt-1.5 text-small text-paper/70">{book.author}</p>
                <p className="mt-3 text-fine text-paper/60">
                  {book.genre} &middot; {book.year} &middot; {book.package}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="rule-quiet mt-10 sm:mt-12" aria-hidden="true" />

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <p className="text-fine text-paper/60">
            {publishedCopy.placeholderNote}
          </p>
          <ButtonLink href="/published" variant="secondary">
            See the full list
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}
