import type { ReactNode } from 'react'
import { BookObject } from '@/components/brand/BookObject'

/**
 * The hero jacket: the front board of a cased book, with the headline printed
 * on it.
 *
 * This replaces the drawn hardback that used to sit under the hero copy with
 * an invented title on it. That book was a picture of the promise; this one is
 * the promise, because the sentence the visitor came to read is set on the
 * cover of the book they are here to make. It also gives the first screen back
 * about four hundred pixels, since the headline and the illustration are now
 * one object instead of two stacked ones.
 *
 * Landscape rather than trade portrait, and deliberately. The board is sized
 * by what is printed on it (BookObject's autoHeight), and a headline set
 * across the width of a column comes out wider than it is tall. A large format
 * book is a real object - it is how an art or photography title is made - and
 * it is the only proportion that lets this hold display type at a size worth
 * setting without running the first screen off the bottom of the window.
 *
 * The spine names the house rather than the book, the way the spine of a
 * publisher's own catalogue does.
 */

export function HeroJacket({ children }: { children: ReactNode }) {
  return (
    <BookObject
      autoHeight
      width="100%"
      /* Narrower than the 11 percent a portrait trade book gets, because the
         spine of a wide book is a smaller share of its face, but wide enough
         to carry lettering that can be read: at 5.5 percent the name was
         squeezed against both edges of the cloth. */
      spine={0.07}
      spineTitle="SG Publication"
      spineAuthor="Selune Global"
      /* The one spine on the site big enough to actually be read, so it is
         set to be read rather than to suggest lettering. */
      spineFontSize="clamp(0.72rem, 1.15vw, 0.95rem)"
      /* The cast, on the outer box: the cover itself clips to the polygon that
         gives the object its three-quarter view, so a shadow declared inside
         it would be cut off at the same edge. A filter on the whole object
         follows that shape instead of boxing it. */
      className="drop-shadow-[0_28px_48px_rgba(0,0,0,0.45)]"
    >
      <div className="jacket px-7 py-9 sm:px-10 sm:py-11 lg:px-12 lg:py-12">
        {children}
      </div>
    </BookObject>
  )
}
