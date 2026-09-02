import type { ReactNode } from 'react'

/**
 * The shell both legal pages are set in.
 *
 * Legal text is the one place on this site that is pure running matter with no
 * illustration and no call to action, so it gets the narrow measure, numbered
 * sections, and a contents list at the top that is a real set of in page links
 * rather than decoration. Someone looking for the deletion clause should reach
 * it in one click.
 *
 * The section numbers come from the array order, so inserting a clause
 * renumbers everything after it automatically and no number can go stale.
 */

export type LegalBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }

export type LegalSection = {
  heading: string
  blocks: LegalBlock[]
}

const sectionId = (heading: string) =>
  `clause-${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

export function LegalDocument({
  id,
  marker,
  title,
  lastUpdated,
  standfirst,
  placeholderNote,
  sections,
  children,
}: {
  id: string
  marker: string
  title: string
  /** Fixed constant, never computed, so the build output is deterministic. */
  lastUpdated: string
  standfirst: string
  /** Shown in visible copy, so a placeholder document cannot ship unnoticed. */
  placeholderNote?: string
  sections: LegalSection[]
  children?: ReactNode
}) {
  return (
    <div className="measure-wide">
      <p className="marker text-gold-ink">{marker}</p>
      <h1 id={id} className="mt-5 text-h2">
        {title}
      </h1>
      <p className="mt-6 text-lead text-ink-soft">{standfirst}</p>
      <p className="mt-4 text-fine text-ink-soft">Last updated {lastUpdated}</p>

      {placeholderNote ? (
        <p className="mt-6 border-l border-gold pl-5 text-small text-gold-ink">
          {placeholderNote}
        </p>
      ) : null}

      {/* Contents. Real links, so the document is navigable without scrolling
          through it, the way a printed contract lists its clauses. */}
      <nav aria-label="Contents" className="mt-10">
        <hr className="rule-gold" aria-hidden="true" />
        <ol className="pt-4">
          {sections.map((section, index) => (
            <li key={section.heading} className="flex gap-4 py-1.5">
              <span className="marker w-6 shrink-0 pt-1 text-ink-soft">
                {String(index + 1).padStart(2, '0')}
              </span>
              <a href={`#${sectionId(section.heading)}`} className="link text-small">
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12">
        {sections.map((section, index) => (
          <section
            key={section.heading}
            id={sectionId(section.heading)}
            className="scroll-mt-28"
          >
            <hr className="rule-quiet" aria-hidden="true" />
            <div className="py-8">
              <h2 className="flex gap-4 text-h3">
                <span className="marker pt-2 text-gold-ink">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{section.heading}</span>
              </h2>

              <div className="mt-4 pl-10">
                {section.blocks.map((block, blockIndex) =>
                  block.kind === 'list' ? (
                    <ul key={blockIndex} className="mt-4 first:mt-0">
                      {block.items.map((item, itemIndex) => (
                        <li key={item}>
                          {itemIndex > 0 ? (
                            <hr className="rule-quiet" aria-hidden="true" />
                          ) : null}
                          <div className="flex gap-4 py-3">
                            <span
                              aria-hidden="true"
                              className="mt-[0.72rem] h-px w-3 shrink-0 bg-gold"
                            />
                            <p className="text-small text-ink-soft">{item}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      key={blockIndex}
                      className="mt-4 text-ink-soft first:mt-0"
                    >
                      {block.text}
                    </p>
                  ),
                )}
              </div>
            </div>
          </section>
        ))}
        <hr className="rule-quiet" aria-hidden="true" />
      </div>

      {children}
    </div>
  )
}
