import Image from 'next/image'
import logoFull from '@/public/logo.png'
import logoMark from '@/public/logo-mark.png'

/**
 * The Selune Global Publication seal: the supplied artwork, rendered.
 *
 * A brown disc carrying an interlocked serif SG monogram in polished gold, a
 * quill standing in a tiered inkpot between the two letters, an open book
 * fanned across the foot, and the wordmark curving beneath it.
 *
 * Every seal on the site comes through this one component, at eight sizes
 * between 34px and 92px, so the artwork is served through next/image: one
 * source, resized and re-encoded to AVIF or WebP per size and per device
 * pixel ratio, rather than a 1080px raster shipped whole to a 38px slot.
 *
 * TWO ASSETS, not one. The wordmark is 25 characters set inside the disc: it
 * reads at 200px and is a grey smear at 38px. public/logo-mark.png is the same
 * artwork with that band repainted out of the field, so a small seal drops the
 * name instead of printing it illegibly. See the README for how it was made;
 * regenerate both together if the artwork is ever replaced.
 *
 * This is the only place in the site where the seal appears. The favicon
 * (app/icon.svg) is drawn by hand instead, because at 16 device pixels the
 * photographic mark collapses into a brown blur.
 */

type SealProps = {
  /** Rendered size in pixels. The artwork is square. */
  size?: number
  className?: string
  /**
   * Accessible name. Omit for decorative use, where the seal is hidden from
   * the accessibility tree and contributes nothing to it.
   */
  title?: string
  /**
   * Whether to use the artwork that carries the wordmark. Below roughly 128px
   * the name stops being letters, so it is dropped by default at small sizes.
   * Pass true or false to override.
   */
  wordmark?: boolean
  /**
   * Opts the seal out of lazy loading. Set on the masthead, which is on screen
   * before anything scrolls and should not fade in after the page has settled.
   */
  priority?: boolean
}

export function Seal({
  size = 96,
  className,
  title,
  wordmark,
  priority,
}: SealProps) {
  const withWordmark = wordmark ?? size >= 128

  return (
    <Image
      src={withWordmark ? logoFull : logoMark}
      alt={title ?? ''}
      width={size}
      height={size}
      /* No `sizes`. With a fixed width next/image emits a two entry srcset,
         the slot and its retina double; `sizes` would instead offer the whole
         ladder of device widths for a mark that is never wider than 92px. */
      quality={90}
      priority={priority}
      aria-hidden={title ? undefined : true}
      className={className}
    />
  )
}
