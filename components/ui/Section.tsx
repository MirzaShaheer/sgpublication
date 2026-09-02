import type { ElementType, ReactNode } from 'react'

/** Page gutter. One container for the whole site. */
export function Container({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  return (
    <As
      className={['mx-auto w-full max-w-[75rem] px-6 sm:px-8 lg:px-12', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </As>
  )
}

type Tone = 'paper' | 'paper-2' | 'dark' | 'dark-deep'

/**
 * Two grounds only: the warm stock and the bark field.
 *
 * `paper` and `paper-2` both paint paper-2 on purpose. The near white
 * --color-paper reads as plain white on a screen and is no longer used as a
 * background anywhere; it survives as the light ink on the bark field. Light
 * bands therefore do not alternate in tone, which is correct for this design:
 * a book separates matter with rules, not with a change of stock, and every
 * section already carries the gold rule pair that does that job.
 *
 * The two names are kept so callers do not all have to change and so the
 * distinction is still available if a third ground is ever wanted.
 */
const tones: Record<Tone, string> = {
  paper: 'bg-paper-2 text-ink',
  'paper-2': 'bg-paper-2 text-ink',
  dark: 'on-dark',
  'dark-deep': 'on-dark bg-bark-deep',
}

/**
 * A band of the page. Sections are separated by a rule pair, the way a book
 * rules above a running head, not by card edges or by a change of shadow.
 */
export function Section({
  children,
  id,
  tone = 'paper',
  className,
  ruled = false,
  labelledBy,
  size = 'md',
}: {
  children: ReactNode
  id?: string
  tone?: Tone
  className?: string
  /** Draw the book rule pair along the top edge of the band. */
  ruled?: boolean
  labelledBy?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const padding =
    size === 'sm'
      ? 'py-4 sm:py-5'
      : size === 'lg'
        ? 'py-7 sm:py-8 lg:py-9'
        : 'py-5 sm:py-6 lg:py-7'

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={[tones[tone], padding, className].filter(Boolean).join(' ')}
    >
      {ruled ? (
        <Container>
          <hr className="rule-pair mb-4 sm:mb-5" />
        </Container>
      ) : null}
      {children}
    </section>
  )
}

/**
 * Section heading. A running head sits above it as a small caps serif marker,
 * used only where a section genuinely needs naming, never as decoration on
 * every heading.
 */
export function SectionHeading({
  id,
  marker,
  title,
  lede,
  align = 'left',
  className,
  level = 2,
  wide = false,
}: {
  id?: string
  marker?: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  className?: string
  level?: 2 | 3
  /**
   * Let the title run the full measure instead of folding at 20ch.
   *
   * The clamp is right for most heads here, which are four or five words and
   * want to sit in a block. It is wrong for a head that is a whole sentence:
   * at 20ch that becomes three short ragged lines, which stops reading as a
   * heading and starts reading as a stray paragraph in a large face. Given
   * the room, such a head should be one line.
   */
  wide?: boolean
}) {
  const Heading = (level === 2 ? 'h2' : 'h3') as ElementType
  return (
    <div
      className={[
        align === 'center' ? 'text-center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {marker ? (
        <p className="marker mb-4 text-gold-ink">{marker}</p>
      ) : null}
      <Heading
        id={id}
        className={[
          'text-h2',
          align === 'center'
            ? wide
              ? 'mx-auto text-balance'
              : 'mx-auto max-w-[22ch]'
            : wide
              ? 'text-balance'
              : 'max-w-[20ch]',
        ].join(' ')}
      >
        {title}
      </Heading>
      {lede ? (
        <p
          className={[
            'measure mt-4 text-lead text-ink-soft',
            align === 'center' ? 'mx-auto' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {lede}
        </p>
      ) : null}
    </div>
  )
}
