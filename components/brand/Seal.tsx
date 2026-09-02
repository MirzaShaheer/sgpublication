import Image from 'next/image'
import logo from '@/public/logo.png'

/**
 * The Selune Global Publication seal: the supplied artwork, rendered.
 *
 * A brown disc carrying an interlocked serif SG monogram in polished gold, a
 * quill standing in a tiered inkpot between the two letters, an open book
 * fanned across the foot, and the wordmark curving beneath it.
 *
 * Every seal on the site comes through this one component, at sizes between
 * 34px and 272px, so the artwork is served through next/image: one source,
 * resized and re-encoded to AVIF or WebP per size and per device pixel ratio,
 * rather than a 1080px raster shipped whole to a 38px slot.
 *
 * ONE ASSET, the supplied artwork, wordmark and all. There was briefly a
 * second copy with the wordmark painted out, for the small sizes where those
 * 25 characters are a couple of pixels tall and can only be a soft band under
 * the monogram rather than a name anyone reads. The house asked for the mark
 * whole, everywhere, so that is what this renders; below roughly 60px the
 * wordmark is texture rather than type, and the masthead and the footer set
 * the name in real letters beside the seal anyway.
 *
 * This is the only place in the page where the seal appears. The favicons and
 * the Apple touch icon are the same artwork, resized ahead of time by the
 * script recorded in the README rather than served through here, because an
 * icon renders outside the document.
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
   * Opts the seal out of lazy loading. Set on the masthead, which is on screen
   * before anything scrolls and should not fade in after the page has settled.
   */
  priority?: boolean
}

export function Seal({ size = 96, className, title, priority }: SealProps) {
  return (
    <Image
      src={logo}
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
