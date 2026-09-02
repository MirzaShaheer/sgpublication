'use client'

import { useEffect, useRef, useState } from 'react'
import { Seal } from '@/components/brand/Seal'
import { markRevealed } from '@/lib/reveal'

/**
 * The opening shelf.
 *
 * A library shelf stands closed across the whole window, the seal stamped on
 * it, and then it parts down the middle: the left half slides out to the left,
 * the right half to the right, both carrying their books with them, and the
 * page is behind it.
 *
 * The two halves are NOT two shelves. Each one holds a copy of the same face,
 * drawn two panels wide and pinned to that half's outer edge, so what the
 * visitor sees before it moves is one continuous run of books with no join in
 * it. The seam only exists once the halves separate.
 *
 * Motion is CSS, not JavaScript, which matters for a thing that paints before
 * anything else: the shelf opens on time even if hydration is slow, and it
 * opens at all if hydration never happens. This component only decides when
 * the veil leaves the document.
 *
 * Timings live in globals.css and are summarised there. The one number this
 * file needs is the total, below, and the two must agree.
 */

/** The full sequence, mark to open shelf. Matches --shelf-total in globals.css. */
const CURTAIN_MS = 1980

/**
 * Whether this page view is the site starting again, in which case it starts
 * at the top of the page.
 *
 * A reload is, and so is arriving fresh. Back and forward are not: there the
 * visitor is returning to something they were already reading, and putting
 * them back at the top would lose their place. A URL carrying a fragment is a
 * deliberate request for somewhere further down and is left alone too.
 */
function startsAtTheTop() {
  if (window.location.hash) return false
  try {
    const [entry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[]
    return !entry || entry.type !== 'back_forward'
  } catch {
    // An engine without the navigation timing entry still gets the top.
    return true
  }
}

/**
 * The running parting animation on a half, or null if the browser cannot say.
 * This is what the veil's life is measured against, rather than a timer of our
 * own: see the effect below for why that difference matters.
 */
function findParting(node: HTMLElement | null) {
  if (!node || typeof node.getAnimations !== 'function') return null
  for (const animation of node.getAnimations()) {
    const named = animation as Animation & { animationName?: string }
    if (named.animationName === 'shelf-part-left') return animation
  }
  return null
}

/* ---------------------------------------------------------------------------
   The shelf.

   Spine widths, heights and tones come from a seeded generator rather than
   from a hand written list, because a shelf that repeats reads as wallpaper.
   The seed is fixed, and that matters more than it looks: this runs once on
   the server and once in the browser, and an unseeded Math.random would hand
   the two of them different shelves and hydrate mismatched.
   ------------------------------------------------------------------------ */

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Every tone is a palette token. The list is weighted by repetition: mostly
 * browns, the way a shelf of trade hardbacks actually looks, with olive, teal
 * and gold-ink for variety and two rare ones, a cream cloth binding and a gilt
 * spine, that give the eye somewhere to land.
 */
const SPINE_TONES = [
  '#4A382E', '#4A382E', '#4A382E', // ink-soft
  '#3E2A20', '#3E2A20', '#3E2A20', // bark
  '#6F5343', '#6F5343',            // a warmer mid brown between the two
  '#55632F', '#55632F',            // olive-ink
  '#1F4E5A', '#1F4E5A',            // teal
  '#8A5F1E', '#8A5F1E',            // gold-ink
  '#7E8F52',                       // olive
  '#E4D8C2',                       // paper-3, a cloth binding
  '#C9973F',                       // gold, one gilt spine now and then
]

type Spine = {
  /** flex-grow, so the row fills any width and keeps its proportions. */
  weight: number
  /** Percentage of the row's height. Books are not all the same size. */
  height: number
  tone: string
  /** A gold rule across the spine, the way a title panel is stamped. */
  band: boolean
}

const SHELF_ROWS = 3
const SPINES_PER_ROW = 22

function buildShelf(): Spine[][] {
  const random = seededRandom(2016_04_18)
  return Array.from({ length: SHELF_ROWS }, () =>
    Array.from({ length: SPINES_PER_ROW }, () => ({
      weight: 1 + Math.round(random() * 14) / 10,
      height: 62 + Math.round(random() * 35),
      tone: SPINE_TONES[Math.floor(random() * SPINE_TONES.length)],
      band: random() < 0.26,
    })),
  )
}

const SHELF = buildShelf()

/** One full width shelf face. Rendered twice, once inside each half. */
function ShelfFace() {
  return (
    <div className="shelf-face" aria-hidden="true">
      <div className="shelf-cornice" />
      {SHELF.map((row, rowIndex) => (
        <div className="shelf-row" key={rowIndex}>
          <div className="shelf-books">
            {row.map((spine, spineIndex) => (
              <span
                key={spineIndex}
                className={spine.band ? 'shelf-spine shelf-spine-band' : 'shelf-spine'}
                style={{
                  flexGrow: spine.weight,
                  height: `${spine.height}%`,
                  backgroundColor: spine.tone,
                }}
              />
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      ))}
    </div>
  )
}

export function ShelfCurtain() {
  const [done, setDone] = useState(false)
  const leftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /* Reduced motion gets no curtain at all. Freezing this one the way the
       rotator freezes would leave a shelf standing in front of the site
       forever, so the honest reading of the preference is to skip it. The CSS
       already hides it, so nothing flashes before this runs. There is no shelf
       to hide a correction behind either, so the top is simply taken. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (startsAtTheTop()) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
      markRevealed()
      setDone(true)
      return
    }

    /* The halves are moved by CSS, which starts at the first paint and runs
       whether React has hydrated or not. The shelf's clock is therefore the
       animation's own and not one started here: on a slow load this effect can
       arrive after the open has already finished, and a fresh 1980ms timer
       would then hold an invisible veil, and the scroll lock with it, over a
       page the visitor can already see. */
    const parting = findParting(leftRef.current)
    if (parting && parting.playState === 'finished') {
      markRevealed()
      setDone(true)
      return
    }

    let live = true
    let frame = 0
    let timer = 0

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (!live) return
      live = false
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      // Setting this twice is harmless; never setting it would leave the page
      // unscrollable.
      document.body.style.overflow = previousOverflow
      /* The page belongs to the visitor from here. Anything on a timer that is
         meant to be counted from their seeing it starts at this moment rather
         than at its own mount. See lib/reveal.ts. */
      markRevealed()
      setDone(true)
    }

    /* Where a reload lands.

       A browser puts a reload back at the offset it left from, and it does so
       after this effect could run, which is why setting history.scrollRestoration
       from the page being restored is already too late: the restore is queued
       by then, and it only takes on the reload after this one. Asking for the
       top once has the same problem. So the top is held every frame for as
       long as the shelf is over the page, and because the shelf is over the
       page, none of the correction is ever seen. */
    if (startsAtTheTop()) {
      const hold = () => {
        if (!live) return
        if (window.scrollY !== 0 || window.scrollX !== 0) {
          // The site sets scroll-behavior: smooth, which would animate this
          // and lose the race with the next frame.
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
        frame = window.requestAnimationFrame(hold)
      }
      hold()
    }

    parting?.finished.then(finish).catch(() => {
      // A cancelled animation is not a reason to strand the veil.
      finish()
    })

    /* Stands behind the animation, and is the whole mechanism on an engine
       without getAnimations. */
    timer = window.setTimeout(finish, CURTAIN_MS)

    return () => {
      live = false
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  if (done) return null

  return (
    <div className="shelf-veil" aria-hidden="true">
      <div className="shelf-panel shelf-panel-left" ref={leftRef}>
        <ShelfFace />
      </div>
      <div className="shelf-panel shelf-panel-right">
        <ShelfFace />
      </div>

      <div className="shelf-mark">
        {/* The mark, at the one size on the site where its wordmark is
            genuinely legible, and with nothing set beneath it: the artwork
            carries the name itself here.

            The intrinsic width matches the top of the clamp in .shelf-mark
            img, so next/image serves that width and its retina double and
            nothing is ever upscaled. priority because this is the first thing
            on screen and must not wait on lazy loading. */}
        <Seal size={272} priority />
        <span className="shelf-progress" />
      </div>
    </div>
  )
}
