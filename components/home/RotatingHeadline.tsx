'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { heroCopy, heroWords } from '@/content/hero'

/**
 * The hero headline, and one of only two motion moments on the site.
 *
 * Three lines of display serif. The middle line is a slot that cycles through
 * the six entry points a first time author arrives from, so a visitor sees
 * themselves named inside the first few seconds.
 *
 * Construction notes, because the constraints drove every decision here:
 *   - All six words are stacked in one grid cell, so the slot always reserves
 *     the line box and nothing measures anything on mount. Zero layout shift.
 *   - Each word carries its OWN gold rule, absolutely positioned inside its own
 *     cell. The cell is sized by the word, so the foil stamp inherits the word
 *     width from layout. No ResizeObserver, no JavaScript measurement.
 *   - The first word is in the server HTML, so there is no empty flash and a
 *     crawler reads a complete sentence.
 *   - The visible headline is aria-hidden and a static duplicate carries the
 *     sentence for screen readers. No aria-live: nobody wants a new word
 *     announced every two seconds.
 *
 * The headline steps down to the h2 size below the small breakpoint. At the
 * hero size the longest word, "finished manuscript", is wider than a phone.
 */

const HOLD_MS = 2200
const TRANSIT_MS = 420
/** The foil rule arrives 80ms after the word settles. */
const RULE_DELAY_MS = TRANSIT_MS + 80
const STEP_MS = HOLD_MS + TRANSIT_MS

/** How far a word travels. Short enough that the mask does the work. */
const TRAVEL = '0.8em'

/*
 * The movement is the original one and is deliberately left alone: both words
 * cover the same distance, over the same 420ms, on the same page curve. That
 * is the part that was right.
 *
 * Only the fades were changed. They used to run the full 420ms in both
 * directions, so halfway through a change both words sat at about half opacity
 * on top of one another, and two different words stacked at half opacity read
 * as a smudge rather than as a change. Now the ink moves faster than the word
 * does: the outgoing one is gone in 240ms, and the incoming one waits 120ms
 * before it starts to appear, so the two barely overlap. The travel is
 * untouched and the slot is still never empty.
 */
const FADE_OUT_MS = 240
const FADE_IN_MS = 300
const FADE_IN_DELAY_MS = 120

type SlotState = 'active' | 'exiting' | 'idle'

const slotStyle: CSSProperties = {
  display: 'grid',
  justifyItems: 'start',
  // Masks the words at the line box edges. Words rise into and out of it.
  overflow: 'hidden',
}

function wordStyle(state: SlotState): CSSProperties {
  return {
    gridArea: '1 / 1',
    position: 'relative',
    // Without this the cell stretches to the longest word and the rule with it.
    justifySelf: 'start',
    whiteSpace: 'nowrap',
    // Air between the descenders and the foil rule.
    paddingBottom: '0.13em',
    pointerEvents: state === 'active' ? undefined : 'none',
    opacity: state === 'active' ? 1 : 0,
    // translateY(0) rather than none for the settled word: none lets the
    // browser drop the compositing layer and build it again on the next
    // change, and that rebuild is a visible hitch on the first frame of the
    // move. Same position, one fewer thing happening.
    transform:
      state === 'active'
        ? 'translateY(0)'
        : state === 'exiting'
          ? `translateY(-${TRAVEL})`
          : `translateY(${TRAVEL})`,
    // An idle word snaps back below the line with no transition. It is already
    // at zero opacity by then, so the reset is never seen.
    transition:
      state === 'idle'
        ? 'none'
        : state === 'exiting'
          ? `opacity ${FADE_OUT_MS}ms var(--ease-page), transform ${TRANSIT_MS}ms var(--ease-page)`
          : `opacity ${FADE_IN_MS}ms var(--ease-page) ${FADE_IN_DELAY_MS}ms, transform ${TRANSIT_MS}ms var(--ease-page)`,
    // Only the two words that are actually moving are promoted. Holding all
    // six on their own layers for the whole visit is how a headline like this
    // ends up costing memory on a phone for no gain.
    willChange: state === 'idle' ? undefined : 'transform, opacity',
  }
}

function ruleStyle(state: SlotState): CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '2px',
    background: 'var(--color-gold)',
    transformOrigin: 'left center',
    transform: state === 'active' ? 'scaleX(1)' : 'scaleX(0)',
    transition:
      state === 'active'
        ? `transform 300ms var(--ease-page) ${RULE_DELAY_MS}ms`
        : state === 'exiting'
          ? 'transform 150ms var(--ease-page)'
          : 'none',
  }
}

function stateFor(index: number, active: number, previous: number): SlotState {
  if (index === active) return 'active'
  if (index === previous) return 'exiting'
  return 'idle'
}

/**
 * `className` sizes the headline for where it is set. The default is the
 * full page opening; the hero passes a smaller step because inside the jacket
 * the line has a board and its padding to fit within, and the longest word,
 * "finished manuscript", is what decides that.
 */
export function RotatingHeadline({
  className = 'text-h2 sm:text-hero',
}: {
  className?: string
} = {}) {
  // One piece of state, so the outgoing and incoming words always agree.
  const [slot, setSlot] = useState({ index: 0, previous: -1 })
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const node = headingRef.current
    if (!node) return

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: number | null = null
    let tabVisible = document.visibilityState !== 'hidden'
    let onScreen = true

    const stop = () => {
      if (timer !== null) {
        window.clearInterval(timer)
        timer = null
      }
    }

    const start = () => {
      if (timer !== null || motion.matches || !tabVisible || !onScreen) return
      timer = window.setInterval(() => {
        setSlot((current) => ({
          index: (current.index + 1) % heroWords.length,
          previous: current.index,
        }))
      }, STEP_MS)
    }

    const sync = () => {
      if (motion.matches || !tabVisible || !onScreen) stop()
      else start()
    }

    const handleMotion = () => {
      // Reduced motion freezes on the first word and never cycles.
      if (motion.matches) setSlot({ index: 0, previous: -1 })
      sync()
    }

    const handleVisibility = () => {
      tabVisible = document.visibilityState !== 'hidden'
      sync()
    }

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting)
      sync()
    })
    observer.observe(node)

    document.addEventListener('visibilitychange', handleVisibility)
    motion.addEventListener('change', handleMotion)

    if (motion.matches) setSlot({ index: 0, previous: -1 })
    sync()

    return () => {
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      motion.removeEventListener('change', handleMotion)
    }
  }, [])

  const sentence = `${heroCopy.lineOne} ${heroWords[0]} ${heroCopy.lineThree}`

  return (
    <h1 id="hero-heading" ref={headingRef} className={className}>
      <span className="sr-only">{sentence}</span>
      <span aria-hidden="true" className="block">
        <span className="block">{heroCopy.lineOne}</span>
        <span style={slotStyle}>
          {heroWords.map((word, index) => {
            const state = stateFor(index, slot.index, slot.previous)
            return (
              <span key={word} style={wordStyle(state)}>
                {word}
                <span style={ruleStyle(state)} />
              </span>
            )
          })}
        </span>
        <span className="block">{heroCopy.lineThree}</span>
      </span>
    </h1>
  )
}
