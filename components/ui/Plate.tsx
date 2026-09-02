import Image from 'next/image'

/**
 * An image, set the way a printed book sets a plate.
 *
 * The site carries no photography yet, so this component exists to hold the
 * space for one properly rather than to leave a section as four paragraphs of
 * prose. Give it a `src` and it renders the picture; leave `src` off and it
 * draws the plate itself: the warm stock, the double gold rule a jacket flap
 * uses, and a small serif label. Both states occupy exactly the same box, so
 * dropping real artwork in later moves nothing on the page.
 *
 * Adding a real image is one prop. Put the file in /public, then:
 *
 *   <Plate src="/plates/editorial.jpg" alt="..." ratio="4 / 5" />
 *
 * The drawing is decorative in the placeholder state, so it is hidden from
 * assistive technology and the caption below carries any meaning. In the image
 * state the alt text does that job and must be written properly.
 */

export type PlateProps = {
  /** Path under /public. Omit to draw the placeholder plate. */
  src?: string
  /** Required whenever `src` is given. Ignored by the placeholder. */
  alt?: string
  /** CSS aspect ratio. Portrait by default, the way a plate is usually set. */
  ratio?: string
  /** Line under the plate, set as a printed caption. */
  caption?: string
  /** Short label struck into the middle of the placeholder. */
  label?: string
  /** Passed to next/image. Only worth setting above the fold. */
  priority?: boolean
  /** Sizes hint for the responsive image. */
  sizes?: string
  className?: string
}

export function Plate({
  src,
  alt,
  ratio = '4 / 5',
  caption,
  label,
  priority = false,
  sizes = '(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 80vw',
  className,
}: PlateProps) {
  return (
    <figure className={className}>
      <div
        className="relative w-full overflow-hidden rounded-plate border border-gold bg-paper-3"
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Image
            src={src}
            alt={alt ?? ''}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <>
            {/* The inner rule, the way a jacket flap frames an author panel. */}
            <span
              aria-hidden="true"
              className="absolute inset-[5px] rounded-[calc(var(--radius-plate)-5px)] border border-gold/45"
            />
            {label ? (
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center px-4 text-center font-display text-h4 leading-tight text-gold-ink"
              >
                {label}
              </span>
            ) : null}
          </>
        )}
      </div>

      {caption ? (
        <figcaption className="mt-3 text-fine text-ink-soft">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
