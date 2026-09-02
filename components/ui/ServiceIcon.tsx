import type { ReactNode } from 'react'
import type { ServiceIconKey } from '@/content/services'

/**
 * The service icon set, drawn as one family by one hand.
 *
 * Every icon is line only: no fill, no plate, no rounded background, a single
 * stroke weight of 1.35 on a 24 unit grid, so at 24px they read as engraved
 * marks rather than as buttons. Colour comes from currentColor, which lets the
 * caller set text-gold on paper, where gold is legal as an icon stroke.
 *
 * The vocabulary is bookmaking: a nib, a marked up proof, a case with a spine,
 * a platen coming down on a sheet, sound off a page, a megaphone, a page in a
 * browser. Icons are decorative here; the accessible name always comes from the
 * service name beside them.
 */

const marks: Record<ServiceIconKey, ReactNode> = {
  /* quill: a feather cut to a nib, and a stroke of ink under it */
  quill: (
    <>
      <path d="M6.8 17.2C8.5 10.6 13.2 5.7 19.6 4c.8 6.9-3.7 12.4-10.2 14Z" />
      <path d="M8.4 16.2C10 12 13.4 8.2 17.6 6.2" />
      <path d="M3 20.6c3.2-1.7 6.4-1.7 9.6 0" />
    </>
  ),
  /* proof: a page with a caret and a deletion marked on it */
  proof: (
    <>
      <path d="M5.4 3.2h8.9l4.3 4.3v13.3H5.4z" />
      <path d="M14.3 3.2v4.3h4.3" />
      <path d="M8.4 9.8h6.6" />
      <path d="M11 12.8l1.4-1.7 1.4 1.7" />
      <path d="M8.4 14.4h6.6" />
      <path d="M8.4 17.4h4.2" />
      <path d="M9.6 18.6l2.2-2.4" />
    </>
  ),
  /* cover: a case seen flat, the spine hinged off at the left with two bands */
  cover: (
    <>
      <path d="M5.6 3.2h12.8v17.6H5.6z" />
      <path d="M8.8 3.2v17.6" />
      <path d="M5.6 7.4h3.2M5.6 16.6h3.2" />
      <path d="M11.4 8.6h4.6M11.4 11.2h3" />
    </>
  ),
  /* press: a platen coming down on a sheet held on the bed */
  press: (
    <>
      <path d="M8 5.6h8" />
      <path d="M12 5.6v3.2" />
      <path d="M4.8 8.8h14.4v3H4.8z" />
      <path d="M6.6 11.8v5.6M17.4 11.8v5.6" />
      <path d="M9.2 13.8h5.6v3.6H9.2z" />
      <path d="M4.2 17.4h15.6" />
    </>
  ),
  /* audio: sound coming off an open book */
  audio: (
    <>
      <path d="M6.8 4.6v2.4M9.4 3v5.6M12 4.4v2.8M14.6 2.6v6M17.2 5v2.2" />
      <path d="M12 12v8.4" />
      <path d="M12 12c-1.8-1.4-4.2-2-7-1.8v8.4c2.8-.2 5.2.4 7 1.8" />
      <path d="M12 12c1.8-1.4 4.2-2 7-1.8v8.4c-2.8-.2-5.2.4-7 1.8" />
    </>
  ),
  /* megaphone: a plain cone, a grip, and two arcs of sound */
  megaphone: (
    <>
      <path d="M3.4 10.2l11.6-5v13.2l-11.6-5z" />
      <path d="M7.6 15.2v3.2" />
      <path d="M6.2 18.4h2.8" />
      <path d="M17.6 8.8c1.4 2 1.4 4.6 0 6.6" />
      <path d="M20 6.8c2 3.2 2 7 0 10.2" />
    </>
  ),
  /* window: a browser that is plainly a page, ruled under its head */
  window: (
    <>
      <path d="M3.4 4.6h17.2v14.8H3.4z" />
      <path d="M3.4 8.6h17.2" />
      <circle cx="6.2" cy="6.6" r="0.6" />
      <circle cx="8.6" cy="6.6" r="0.6" />
      <path d="M6.4 11.8h5.6" />
      <path d="M6.4 14.6h11.2M6.4 17h7.4" />
    </>
  ),
}

export function ServiceIcon({
  name,
  size = 24,
  className,
}: {
  name: ServiceIconKey
  /** Rendered size in pixels. The set is drawn on a 24 unit grid. */
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {marks[name]}
    </svg>
  )
}
