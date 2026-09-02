import type { CSSProperties } from 'react'
import { BookObject } from '@/components/brand/BookObject'
import { GeneratedCover } from '@/components/brand/GeneratedCover'
import { heroCopy } from '@/content/hero'

/**
 * The hero illustration: one hardback, drawn as an object, marked up the way a
 * proof is marked up in pencil. Three notes point at the cover, the spine and
 * the page edge, each naming one thing SG Publication handles, so the picture
 * carries an argument instead of decorating the page.
 *
 * There is no floating cover collage here. One book, sitting on the paper with
 * its own contact shadow, reads as a real object; six of them floating do not.
 *
 * The notes are a real list, since the labels say something the hero copy does
 * not. Only the leader lines and their dots are hidden from screen readers.
 */

/* PLACEHOLDER: an invented title and author, in the register of a first time
   author SG works with. Replace with a real jacket before launch. */
const BOOK = {
  title: 'The Quiet Practice',
  author: 'Amara Osei',
  spineAuthor: 'Osei',
}

/**
 * Where each leader line ends, as a share of the illustration width. The book
 * occupies the left 58 percent, so the spine mark lands on the spine, the cover
 * mark lands on the artwork, and the edge mark lands on the fore edge.
 */
type AnnotationTarget = (typeof heroCopy.annotations)[number]['target']

const marks: Record<AnnotationTarget, { top: string; left: string }> = {
  cover: { top: '19%', left: '34%' },
  spine: { top: '50%', left: '3%' },
  edge: { top: '81%', left: '56.5%' },
}

const noteStyle: CSSProperties = { position: 'absolute', right: 0 }

const leaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '0.35rem',
}

const dotStyle: CSSProperties = {
  flex: '0 0 auto',
  width: '4px',
  height: '4px',
  borderRadius: '2px',
  background: 'var(--color-gold)',
}

const hairlineStyle: CSSProperties = {
  flex: '1 1 auto',
  height: '1px',
  background: 'var(--color-gold)',
}

export function HeroBook() {
  return (
    <div className="relative mx-auto w-full max-w-[23rem] lg:mx-0 lg:max-w-none">
      <div aria-hidden="true">
        <BookObject
          width="58%"
          spineTitle={BOOK.title}
          spineAuthor={BOOK.spineAuthor}
        >
          <GeneratedCover
            title={BOOK.title}
            author={BOOK.author}
            seed="hero-book"
            archetype="frame"
            palette={0}
            className="block h-full w-full"
          />
        </BookObject>
      </div>

      <ul className="m-0 list-none p-0">
        {heroCopy.annotations.map((annotation) => {
          const mark = marks[annotation.target]
          return (
            <li
              key={annotation.target}
              style={{ ...noteStyle, top: mark.top, left: mark.left }}
            >
              <span className="ml-auto block max-w-[8.5rem] text-right font-display text-fine italic text-ink-soft">
                {annotation.label}
              </span>
              <span aria-hidden="true" style={leaderStyle}>
                <span style={dotStyle} />
                <span style={hairlineStyle} />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
