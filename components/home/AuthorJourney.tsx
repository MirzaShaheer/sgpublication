'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { JourneyObject } from '@/components/home/JourneyObject'
import { JourneyStageCard } from '@/components/home/JourneyStageCard'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section, SectionHeading } from '@/components/ui/Section'
import { journey, journeyCopy } from '@/content/journey'

/**
 * The six stages, as one object becoming a book.
 *
 * Built in two layers, in this order.
 *
 * The base is a plain vertical run of the six stages, each with a static
 * drawing of its own state beside it. That is what the server sends, what
 * renders with JavaScript turned off, what a narrow or short viewport gets,
 * and what anyone who asks for reduced motion gets. Nothing in it depends on
 * script: all six stages, both work columns and every timeframe are readable
 * as flat HTML.
 *
 * The enhancement, added on wide and tall viewports only, turns that same
 * content into a scroll driven sequence. A tall track holds a sticky, viewport
 * height stage. The page keeps scrolling at its own speed: nothing is hijacked,
 * no wheel event is swallowed, no snap fights the reader. Scroll position is
 * read from the track's bounding rect inside a requestAnimationFrame, turned
 * into a progress value from zero to one, and the stage index falls out of it.
 * The copy travels horizontally, one panel per stage, while the object holds
 * still in the centre of the stage and transforms in place.
 *
 * The progress rule is written straight to the DOM inside the frame rather
 * than through React state, so a scroll costs one style write instead of a
 * render of six stages. React state changes at most six times per pass.
 *
 * This is one of exactly two motion moments on the site, and it is spent here.
 */

/* Scroll spent on each stage while the stage is stuck, as a share of the
   viewport. Six stages at this height give each one a couple of unhurried
   flicks of the wheel and keep the whole section a readable length. */
const STAGE_TRAVEL_VH = 62

/* The sequence needs room for the object beside two full work columns, and
   height for the stage to sit inside the viewport without being cut off. Below
   this, the vertical list is the better reading anyway. */
const ROOM_QUERY = '(min-width: 64rem) and (min-height: 48rem)'
const CALM_QUERY = '(prefers-reduced-motion: reduce)'

/*
 * Each stage is a band of its own, and the six of them carry on the brown and
 * light rhythm the rest of the page runs on rather than pausing it while the
 * section plays out. A stage is a section in every way that matters: it has
 * its own rule pair, its own running head, its own two ledgers and its own
 * timeframe, so it should stand on its own ground too.
 *
 * bg-paper-2 is the ground in both cases, and that is the whole trick: on-dark
 * re-points --color-paper-2 to bark, so a single utility paints either field
 * and every token inside the stage, the rules, the gold and the soft ink,
 * follows it across without one word of the stage being written twice.
 */
/* In step with the padding a Section carries. These are bands in their own
   right, so a stage that sat deeper than the sections around it would read as
   the page loosening off exactly where it is meant to be moving. */
const STAGE_BAND = 'bg-paper-2 py-6 sm:py-7'

function stageBand(i: number) {
  return i % 2 === 0 ? `${STAGE_BAND} on-dark` : STAGE_BAND
}

export function AuthorJourney() {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLSpanElement>(null)
  const markRef = useRef<HTMLSpanElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(0)

  /* Starts false on both the server and the first client render, so the list
     hydrates cleanly and the sequence is switched on afterwards. */
  const [enhanced, setEnhanced] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const room = window.matchMedia(ROOM_QUERY)
    const calm = window.matchMedia(CALM_QUERY)
    const sync = () => setEnhanced(room.matches && !calm.matches)
    sync()
    room.addEventListener('change', sync)
    calm.addEventListener('change', sync)
    return () => {
      room.removeEventListener('change', sync)
      calm.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enhanced) {
      indexRef.current = 0
      setIndex(0)
      return
    }

    let frame = 0

    const read = () => {
      frame = 0
      const track = trackRef.current
      const stage = stageRef.current
      if (!track || !stage) return

      const rect = track.getBoundingClientRect()
      /* Distance the track scrolls while the stage is stuck. Measured from the
         stage itself rather than from the viewport, so a stage that has grown
         taller than the viewport still produces a sane progress value. */
      const travel = rect.height - stage.offsetHeight
      const progress =
        travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0

      /* The panel viewport is a scroll container, so a page opened on a stage
         anchor can leave it scrolled sideways. Keep it pinned to zero and let
         the transform do all the travelling. */
      if (viewportRef.current && viewportRef.current.scrollLeft !== 0) {
        viewportRef.current.scrollLeft = 0
      }

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`
      }
      if (markRef.current) {
        markRef.current.style.left = `${progress * 100}%`
      }

      /* Floor, then clamp: at a progress of exactly one the floor lands past
         the end, and the last stage has to stay reachable. */
      const next = Math.min(
        journey.length - 1,
        Math.floor(progress * journey.length),
      )
      if (next !== indexRef.current) {
        indexRef.current = next
        setIndex(next)
      }
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enhanced])

  /**
   * Scroll to the middle of a stage's band. Returns false when the sequence is
   * not running, in which case the marker is left to behave as the plain
   * in page link it already is.
   */
  const jumpToStage = useCallback(
    (i: number) => {
      const track = trackRef.current
      const stage = stageRef.current
      if (!enhanced || !track || !stage) return false

      const rect = track.getBoundingClientRect()
      const travel = rect.height - stage.offsetHeight
      if (travel <= 0) return false

      const target =
        window.scrollY + rect.top + ((i + 0.5) / journey.length) * travel
      window.scrollTo({ top: target, behavior: 'smooth' })
      return true
    },
    [enhanced],
  )

  const active = journey[index]

  return (
    <Section id="stages" ruled labelledBy="journey-title">
      <Container>
        {/* wide: the head is a full sentence and folds into three ragged
            lines at the default 20ch, which reads as a paragraph in a big
            face rather than as a heading. Given the measure it sets on one
            line, and balances rather than orphans a word when it cannot. */}
        <SectionHeading
          id="journey-title"
          wide
          title={journeyCopy.heading}
          lede={journeyCopy.lede}
        />
      </Container>

      <div
        ref={trackRef}
        className={enhanced ? 'relative mt-9' : 'mt-9'}
        style={
          enhanced
            ? {
                height: `calc(100svh + ${journey.length * STAGE_TRAVEL_VH}svh)`,
              }
            : undefined
        }
      >
        <div
          ref={stageRef}
          className={
            enhanced
              ? [
                  'sticky top-0 flex min-h-svh flex-col justify-center bg-paper-2 pb-10 pt-24',
                  /* The ground turns over with the stage, on the same rhythm
                     the bands of the page run on, so moving from one stage to
                     the next reads as arriving somewhere rather than as one
                     panel swapping its words.

                     Kept short deliberately. Only this element's own colours
                     transition; the marker and the soft body copy inside it
                     are painted from --color-gold-ink and --color-ink-soft,
                     which are re-pointed by on-dark and change the instant the
                     class lands. Fade the field over half a second and there
                     is a quarter of a second of dark-ground text sitting on a
                     half-light ground, which is unreadable. At this length the
                     mismatch is too brief to see, and it still beats the hard
                     snap of no transition at all. */
                  'transition-colors duration-200 ease-page',
                  index % 2 === 0 ? 'on-dark' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
              : undefined
          }
        >
          <Container>
            {/* ---- the progress rule ------------------------------------- */}
            {/* A gold hairline across the six stages with a foil mark
                travelling along it. The names are the way through for anyone
                using a keyboard, and plain in page links without script. */}
            <nav aria-label="The six stages">
              <div className="relative">
                <span aria-hidden="true" className="block h-px w-full bg-paper-3" />
                {enhanced ? (
                  <>
                    <span
                      ref={fillRef}
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-px origin-left bg-gold"
                      style={{ transform: 'scaleX(0)' }}
                    />
                    <span
                      ref={markRef}
                      aria-hidden="true"
                      className="absolute top-0 h-2.25 w-2.25 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gold"
                      style={{ left: '0%' }}
                    />
                  </>
                ) : null}
              </div>

              <ol
                className={
                  enhanced
                    ? 'grid grid-cols-6'
                    : 'flex flex-wrap gap-x-7 gap-y-1'
                }
              >
                {journey.map((stage, i) => {
                  const reached = enhanced && i <= index
                  return (
                    <li key={stage.id}>
                      {enhanced ? (
                        <span
                          aria-hidden="true"
                          className={[
                            'block h-2 w-px transition-colors duration-200 ease-page',
                            reached ? 'bg-gold' : 'bg-paper-3',
                          ].join(' ')}
                        />
                      ) : null}
                      <a
                        href={`#journey-stage-${stage.id}`}
                        aria-current={
                          enhanced && i === index ? 'step' : undefined
                        }
                        onClick={(event) => {
                          if (jumpToStage(i)) event.preventDefault()
                        }}
                        className={[
                          /* min-h-11 rather than padding alone: the label is
                             13px on a single leading, so py-3 gave a 37px
                             target on a phone, under the 44px a thumb needs.
                             The extra height is inside the row, so nothing
                             about the desktop rule moves. */
                          'marker flex min-h-11 items-center py-3 transition-colors duration-200 ease-page hover:text-gold-ink',
                          reached ? 'text-gold-ink' : 'text-ink-soft',
                        ].join(' ')}
                      >
                        {stage.name}
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>

            {/* ---- the stage, when the sequence is running --------------- */}
            {enhanced ? (
              <div className="mt-8 grid grid-cols-12 items-center gap-x-12">
                <figure className="col-span-5 m-0 xl:col-span-4">
                  <JourneyObject
                    state={active.objectState}
                    idSuffix="stage"
                    className="mx-auto h-auto max-h-[38svh] w-full max-w-96"
                  />
                  {/* All six captions share one grid cell, so the line changes
                      without the object moving underneath it. */}
                  <figcaption className="mt-6 grid text-center">
                    {journey.map((stage, i) => (
                      <span
                        key={stage.id}
                        aria-hidden={i !== index}
                        className="font-display text-small italic text-ink-soft"
                        style={{
                          gridArea: '1 / 1',
                          opacity: i === index ? 1 : 0,
                          transition: 'opacity 380ms var(--ease-page)',
                        }}
                      >
                        {stage.objectCaption}
                      </span>
                    ))}
                  </figcaption>
                </figure>

                <div
                  ref={viewportRef}
                  className="col-span-7 overflow-hidden xl:col-span-8"
                >
                  <div
                    className="flex"
                    style={{
                      /* The row is one panel wide per stage, so a panel is a
                         sixth of the row it is translated inside. */
                      transform: `translateX(-${
                        (index * 100) / journey.length
                      }%)`,
                      transition: 'transform 620ms var(--ease-page)',
                    }}
                  >
                    {journey.map((stage) => (
                      <JourneyStageCard
                        key={stage.id}
                        stage={stage}
                        mode="sequence"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </Container>

          {/* ---- the stages, as a vertical run of bands ------------------ */}
          {/* Outside the Container on purpose: each ground has to run the full
              width of the page to read as a band, so the gutter is put back
              inside each one rather than wrapped around all six. */}
          {enhanced ? null : (
            <div className="mt-8 sm:mt-10">
              {journey.map((stage, i) => (
                <div key={stage.id} className={stageBand(i)}>
                  <Container>
                    <JourneyStageCard stage={stage} mode="list" />
                  </Container>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Container>
        <div className="mt-10 sm:mt-12">
          <hr className="rule-gold" aria-hidden="true" />
          <p className="mt-8">
            <ButtonLink href={journeyCopy.cta.href} size="lg">
              {journeyCopy.cta.label}
            </ButtonLink>
          </p>
        </div>
      </Container>
    </Section>
  )
}
