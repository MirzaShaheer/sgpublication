import type { ServicePageBlock } from '@/content/service-pages'

/**
 * The long form body of a service page.
 *
 * A content file describes a page as an ordered run of blocks and has no
 * opinion about how any of them look. This file is where each kind gets its
 * typographic treatment, so the whole set can be re-set at once and no content
 * file ever has to be touched to change a margin.
 *
 * Nothing here is a card. Matter is separated by rules and by space, the way a
 * printed page separates a sidebar from the text around it, which is the same
 * rule the rest of the site follows.
 */

/**
 * A stable, readable fragment id for a block heading, so the contents list can
 * link to it and a reader can send somebody a link to one section.
 *
 * Derived from the heading text rather than from the index: an id built from a
 * position changes meaning the moment a block is inserted above it, which
 * quietly breaks every link anybody has shared.
 */
export function blockId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** The headings a reader can jump to, in document order. */
export function blockHeadings(blocks: ServicePageBlock[]) {
  // Every block kind carries `heading`; it is optional only on `prose`, which
  // is why the result is narrowed rather than mapped straight through.
  return blocks
    .map((block) => block.heading)
    .filter((heading): heading is string => Boolean(heading))
}

function BlockHeading({ children }: { children: string }) {
  return (
    <h2
      id={blockId(children)}
      className="max-w-[24ch] text-h3 scroll-mt-24 sm:text-h2"
    >
      {children}
    </h2>
  )
}

function Prose({
  heading,
  paragraphs,
}: {
  heading?: string
  paragraphs: string[]
}) {
  return (
    <div>
      {heading ? <BlockHeading>{heading}</BlockHeading> : null}
      <div className={heading ? 'mt-6' : ''}>
        {paragraphs.map((paragraph, index) => (
          <p
            key={paragraph.slice(0, 32)}
            className={[
              'measure-wide text-ink-soft',
              index > 0 ? 'mt-5' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}

/**
 * A defined term and its explanation. Set as a real description list, so the
 * relationship survives being read out by a screen reader, and split into two
 * columns on wide screens so the terms can be scanned down the left edge the
 * way a glossary is scanned.
 */
function DefinitionList({
  heading,
  intro,
  items,
}: {
  heading: string
  intro?: string
  items: { term: string; detail: string }[]
}) {
  return (
    <div>
      <BlockHeading>{heading}</BlockHeading>
      {intro ? (
        <p className="measure-wide mt-5 text-lead text-ink-soft">{intro}</p>
      ) : null}

      <dl className="mt-10">
        {items.map((item) => (
          <div
            key={item.term}
            className="grid gap-x-10 border-t border-paper-3 py-6 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:py-7"
          >
            <dt className="font-display text-h4 text-ink">{item.term}</dt>
            <dd className="measure-wide mt-2 text-ink-soft sm:mt-0">
              {item.detail}
            </dd>
          </div>
        ))}
      </dl>
      <hr className="rule-quiet" aria-hidden="true" />
    </div>
  )
}

/**
 * An ordered process, drawn as a timeline.
 *
 * This block used to be rows separated by rules, which is how the rest of the
 * page is set and is exactly why it did not work here: a sequence looked the
 * same as a glossary, so the one block on the page that answers "what actually
 * happens, and in what order" read as more prose to get through. It is now
 * drawn as what it is. A gold hairline runs down through numbered marks, and
 * the timeframe sits under each step name as a marker line, so the shape of
 * the process and its total length are both legible before a word of the
 * detail is read.
 *
 * The spine and the numbers are decorative: the list is a real <ol> and each
 * step names itself, so the drawing is hidden from assistive technology. The
 * mark carries the band's own ground as its fill, which is what lets the
 * hairline pass behind it without being drawn in segments.
 */
function Steps({
  heading,
  intro,
  steps,
}: {
  heading: string
  intro?: string
  steps: { name: string; detail: string; timeframe?: string }[]
}) {
  return (
    <div>
      <BlockHeading>{heading}</BlockHeading>
      {intro ? (
        <p className="measure-wide mt-5 text-lead text-ink-soft">{intro}</p>
      ) : null}

      <ol className="relative mt-10">
        {/* Inset top and bottom by half a mark, so the spine begins and ends
            inside the first and last numbers rather than running past them. */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[1.125rem] top-6 w-px bg-gold/35"
        />

        {steps.map((step, index) => (
          <li
            key={step.name}
            className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 sm:gap-x-8"
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-control border border-gold bg-paper-2 font-display text-small leading-none text-gold-ink"
            >
              {index + 1}
            </span>

            <div className="min-w-0 pt-1.5">
              <h3 className="font-display text-h4 text-ink">{step.name}</h3>
              {step.timeframe ? (
                <p className="marker mt-2 text-gold-ink">{step.timeframe}</p>
              ) : null}
              <p className="measure-wide mt-3 text-ink-soft">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * The block where we say the thing that is not in our favour. It is set apart
 * on the second paper with a gold rule struck across the head, the way a
 * printed book sets a note apart from the argument around it.
 */
function Callout({
  heading,
  paragraphs,
}: {
  heading: string
  paragraphs: string[]
}) {
  return (
    <aside className="rounded-panel bg-paper-2 px-6 py-9 sm:px-10 sm:py-11">
      <hr className="rule-gold" aria-hidden="true" />
      <h2
        id={blockId(heading)}
        className="mt-6 max-w-[26ch] text-h3 scroll-mt-24"
      >
        {heading}
      </h2>
      {paragraphs.map((paragraph, index) => (
        <p
          key={paragraph.slice(0, 32)}
          className={['measure-wide text-ink-soft', index === 0 ? 'mt-5' : 'mt-4'].join(
            ' ',
          )}
        >
          {paragraph}
        </p>
      ))}
    </aside>
  )
}

export function ServiceBlocks({ blocks }: { blocks: ServicePageBlock[] }) {
  return (
    <div className="space-y-16 sm:space-y-20">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'prose':
            return (
              <Prose
                key={`${block.kind}-${index}`}
                heading={block.heading}
                paragraphs={block.paragraphs}
              />
            )
          case 'list':
            return (
              <DefinitionList
                key={`${block.kind}-${index}`}
                heading={block.heading}
                intro={block.intro}
                items={block.items}
              />
            )
          case 'steps':
            return (
              <Steps
                key={`${block.kind}-${index}`}
                heading={block.heading}
                intro={block.intro}
                steps={block.steps}
              />
            )
          case 'callout':
            return (
              <Callout
                key={`${block.kind}-${index}`}
                heading={block.heading}
                paragraphs={block.paragraphs}
              />
            )
        }
      })}
    </div>
  )
}
