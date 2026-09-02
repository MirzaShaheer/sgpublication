import { BookObject } from '@/components/brand/BookObject'
import { coverPalettes, GeneratedCover } from '@/components/brand/GeneratedCover'
import type { Book } from '@/content/books'

/**
 * One plate in the catalogue.
 *
 * The book is the object and the caption sits under it, unboxed, the way a
 * printed catalogue sets a plate caption: title in the display serif, author in
 * the body sans, genre as a quiet small caps marker. No border, no tile, no
 * shadow of its own. The only edge in the frame is the edge of the book.
 *
 * PLACEHOLDER: every title, author and cover on this site is invented sample
 * work drawn from the brand palette. Replace with real jackets, and with each
 * author's written permission, before launch.
 *
 * Deliberately a plain function with no hooks. It is imported by the client
 * side grid, so keeping the SVG composition free of state keeps twelve covers
 * cheap to render.
 */

/**
 * The spine has to belong to the same palette as the artwork it is bound to.
 * Every palette carries bg2, the darker second ground the split archetypes use,
 * which is exactly the relationship a spine has to a cover: the same stock, one
 * step deeper. So spine colour is bg2 (falling back to bg) and spine ink is the
 * palette accent, which is the colour the cover already stamps its rules in.
 *
 * The hash mirrors the one inside GeneratedCover so that a book which does not
 * name a palette still resolves cover and spine to the same one.
 */
function paletteFor(book: Book) {
  if (typeof book.palette === 'number') {
    return coverPalettes[book.palette % coverPalettes.length]
  }
  let h = 0
  for (let i = 0; i < book.slug.length; i += 1) {
    h = (h * 31 + book.slug.charCodeAt(i)) >>> 0
  }
  return coverPalettes[Math.floor(h / 7) % coverPalettes.length]
}

export function BookCard({ book }: { book: Book }) {
  const palette = paletteFor(book)

  return (
    <figure className="flex flex-col">
      {/* The cover names its own title and author to assistive technology, and
          the caption below repeats all of it in text, so the object itself is
          hidden rather than read out twice. */}
      <div aria-hidden="true" className="pt-1">
        <BookObject
          width="100%"
          spineTitle={book.title}
          spineAuthor={book.author}
          spineColor={palette.bg2 ?? palette.bg}
          spineInk={palette.accent}
        >
          <GeneratedCover
            title={book.title}
            author={book.author}
            seed={book.slug}
            archetype={book.archetype}
            palette={book.palette}
            className="block h-full w-full"
          />
        </BookObject>
      </div>

      <figcaption className="mt-7 sm:mt-8">
        <p className="font-display text-h4 text-ink">{book.title}</p>
        <p className="mt-1.5 text-small text-ink-soft">{book.author}</p>
        <p className="marker mt-3 text-ink-soft">{book.genre}</p>
      </figcaption>
    </figure>
  )
}
