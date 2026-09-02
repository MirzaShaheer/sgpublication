/**
 * When the page was actually revealed to the visitor.
 *
 * The opening shelf stands across the window for its first two seconds, so
 * "four seconds after the site loads" and "four seconds after this component
 * mounted" are two different moments, and only the first one is the one a
 * visitor would recognise. Anything on a timer that is meant to be measured
 * from the visitor seeing the page reads its start from here rather than from
 * its own mount.
 *
 * The moment is stamped on the document element rather than held in a module
 * variable so it survives being read from a different bundle, and so it can be
 * seen in the DOM when working out why a timer fired when it did.
 */

export const REVEAL_EVENT = 'sg:revealed'

const ATTR = 'data-revealed-at'

/** Called once, by whatever takes the last covering layer off the page. */
export function markRevealed() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  // First writer wins. A second call is a no-op rather than a reset, so a
  // remount cannot push every timer that depends on this back again.
  if (root.hasAttribute(ATTR)) return
  root.setAttribute(ATTR, String(Date.now()))
  window.dispatchEvent(new Event(REVEAL_EVENT))
}

/** The reveal time, or null while the page is still behind something. */
export function revealedAt(): number | null {
  if (typeof document === 'undefined') return null
  const raw = document.documentElement.getAttribute(ATTR)
  if (raw === null) return null
  const at = Number(raw)
  return Number.isFinite(at) ? at : null
}
