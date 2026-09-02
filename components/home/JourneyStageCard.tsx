import Link from 'next/link'

import { JourneyObject } from '@/components/home/JourneyObject'
import type { JourneyStage } from '@/content/journey'

/**
 * One stage of the six, set like a chapter opening.
 *
 * The two work columns are the reason this section exists. Most publishing
 * companies list what they do and leave the author to discover in month three
 * what they owe, so "What you do" is given exactly the same width, the same
 * label treatment and the same gold hairline as "What we do". Neither column
 * is tucked under the other, and neither is smaller.
 *
 * There is no card here in the boxed sense: the matter is separated by rules,
 * the way a printed page separates a running head from the text beneath it.
 *
 * The same component serves both readings of the section. In `list` mode it is
 * a block in a vertical run with its own drawing beside it, which is what
 * renders on the server, without JavaScript, and under prefers-reduced-motion.
 * In `sequence` mode it is one panel of the horizontal track, and the drawing
 * is dropped because the sticky stage carries a single shared object instead.
 *
 * In list mode the vertical padding belongs to the band around this, not to
 * this, because each stage now has a ground of its own and the padding has to
 * be inside that ground rather than above it. The rule pair stays here: it is
 * the same pair a ruled Section draws along its top edge, which is exactly
 * what a stage is now.
 */

const ordinals = ['one', 'two', 'three', 'four', 'five', 'six'] as const

type Mode = 'list' | 'sequence'

/**
 * How many of each ledger the home page shows.
 *
 * All seven used to run here, which meant the home page reprinted the whole of
 * /how-it-works: six stages times seven lines is about five hundred words of
 * list before a visitor has reached the packages. Two lines a side still makes
 * the point the section exists to make, which is that the right hand column is
 * as real as the left, and the count of what is not shown keeps it honest
 * rather than looking like the whole of it.
 */
const HOME_ITEMS = 2

function Ledger({
  label,
  items,
  compact,
}: {
  label: string
  items: string[]
  compact: boolean
}) {
  const shown = items.slice(0, HOME_ITEMS)
  const rest = items.length - shown.length

  return (
    <div>
      <hr className="rule-gold" aria-hidden="true" />
      <h4 className="marker mt-3 text-gold-ink">{label}</h4>
      <ul className="mt-3">
        {shown.map((item, i) => (
          <li key={item}>
            {i > 0 ? <hr className="rule-quiet" aria-hidden="true" /> : null}
            <p
              className={[
                'text-small text-ink-soft',
                compact ? 'py-2.5' : 'py-3',
              ].join(' ')}
            >
              {item}
            </p>
          </li>
        ))}
        {rest > 0 ? (
          <li>
            <hr className="rule-quiet" aria-hidden="true" />
            <p
              className={[
                'marker text-ink-soft',
                compact ? 'py-2.5' : 'py-3',
              ].join(' ')}
            >
              and {rest} more
            </p>
          </li>
        ) : null}
      </ul>
    </div>
  )
}

export function JourneyStageCard({
  stage,
  mode = 'list',
}: {
  stage: JourneyStage
  mode?: Mode
}) {
  const sequence = mode === 'sequence'
  const titleId = `journey-stage-${stage.id}-title`
  const step = ordinals[stage.index - 1] ?? String(stage.index)

  const copy = (
    <div>
      <p className="marker text-gold-ink">Stage {step}</p>
      <h3 id={titleId} className="mt-3 text-h3">
        {stage.name}
      </h3>
      <p
        className={[
          'measure-wide text-ink-soft',
          sequence ? 'mt-4' : 'mt-4 sm:mt-5',
        ].join(' ')}
      >
        {stage.summary}
      </p>

      <div
        className={[
          'grid gap-x-10 gap-y-8',
          sequence ? 'mt-5 sm:grid-cols-2' : 'mt-6 sm:mt-7 lg:grid-cols-2',
        ].join(' ')}
      >
        <Ledger label="What we do" items={stage.sgDoes} compact={sequence} />
        <Ledger label="What you do" items={stage.authorDoes} compact={sequence} />
      </div>

      {/* Where the rest of it is. The stage anchors on /how-it-works carry the
          same ids, so this lands on the full version of this stage rather than
          at the top of the page. */}
      <p className={sequence ? 'mt-5' : 'mt-6'}>
        <Link
          href={`/how-it-works#${stage.id}`}
          className="marker text-gold-ink underline decoration-transparent decoration-1 underline-offset-[0.25em] transition-[text-decoration-color] duration-200 ease-page hover:decoration-gold focus-visible:decoration-gold"
        >
          Stage {step} in full
        </Link>
      </p>

      {/* The timeframe row that used to close a stage is gone. The two
          ledgers are what this section is for; a duration under each one
          turned every stage into a quotation for a slot of time and invited
          the reader to add the six of them up, which is not how a book is
          made. The honest overall answer lives on /how-it-works and in the
          FAQ, where it can be given with its conditions attached. */}
    </div>
  )

  if (sequence) {
    return (
      <article
        id={`journey-stage-${stage.id}`}
        aria-labelledby={titleId}
        className="w-full min-w-full shrink-0"
      >
        {copy}
      </article>
    )
  }

  return (
    <article
      id={`journey-stage-${stage.id}`}
      aria-labelledby={titleId}
      className="scroll-mt-28"
    >
      <hr className="rule-pair" aria-hidden="true" />
      <div className="mt-6 grid gap-7 sm:mt-7 sm:grid-cols-12 sm:gap-9">
        <figure className="m-0 sm:col-span-4">
          <JourneyObject
            state={stage.objectState}
            still
            className="h-auto w-full max-w-60"
          />
          <figcaption className="mt-4 font-display text-small italic text-ink-soft">
            {stage.objectCaption}
          </figcaption>
        </figure>
        <div className="sm:col-span-8">{copy}</div>
      </div>
    </article>
  )
}
