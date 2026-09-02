'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Seal } from '@/components/brand/Seal'
import {
  LeadCaptureForm,
  PanelCloseButton,
  leadOffer,
  useOverlayPanel,
} from '@/components/lead/LeadFields'
import { useLead } from '@/components/lead/LeadProvider'

/**
 * The capture point under 768px, where the modal is not allowed to go.
 *
 * Google counts an intrusive interstitial on a small screen as a ranking
 * negative when it appears on entry, so nothing covers the page here. A bar
 * sits along the bottom edge instead, fifteen seconds in, carrying the same
 * offer. Collapsed it is a region, not a dialog: it takes no focus, traps
 * none, and the page behind it keeps scrolling. Tapping it opens the same two
 * step form as a near full screen sheet, and that sheet is a real dialog with
 * every rule the modal follows.
 *
 * The slide up is the only motion here, it runs on the site easing curve, and
 * it is skipped outright when the visitor asks for reduced motion, in
 * JavaScript as well as in CSS.
 */
export function MobileLeadBar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { converted } = useLead()
  const barTitleId = useId()
  const sheetTitleId = useId()

  const [expanded, setExpanded] = useState(false)
  const [shown, setShown] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement | null>(null)

  /* Escape, the backdrop and the sheet's close control all collapse back to
     the bar, which is the way out of the dialog without throwing the offer
     away. Once the visitor has converted there is nothing left to come back
     to, so the same controls dismiss the whole thing. */
  const closeSheet = useCallback(() => {
    if (converted) onClose()
    else setExpanded(false)
  }, [converted, onClose])

  const panelRef = useOverlayPanel(expanded, closeSheet, openButtonRef)

  useEffect(() => {
    if (!open) {
      setShown(false)
      setExpanded(false)
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    /* Two frames: the bar has to paint at its resting place off screen before
       the class that moves it up can transition from anything. */
    let inner = 0
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setShown(true))
    })
    return () => {
      window.cancelAnimationFrame(outer)
      window.cancelAnimationFrame(inner)
    }
  }, [open])

  if (!open) return null

  if (expanded) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col md:hidden">
        <div
          role="presentation"
          aria-hidden="true"
          onClick={closeSheet}
          className="absolute inset-0 bg-bark/60"
        />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={sheetTitleId}
          tabIndex={-1}
          className="relative mt-auto max-h-[94vh] w-full overflow-y-auto overscroll-contain rounded-t-plate border-t border-gold bg-paper-2 px-5 pt-7"
          style={{ paddingBottom: 'calc(2.25rem + env(safe-area-inset-bottom))' }}
        >
          <PanelCloseButton
            onClose={closeSheet}
            label="Close this offer"
            className="absolute right-3 top-3"
          />

          <Seal size={42} />

          <h2 id={sheetTitleId} className="mt-4 max-w-[18ch] pr-10 text-h3">
            {leadOffer.heading}
          </h2>
          <p className="mt-3 text-small text-ink-soft">{leadOffer.lede}</p>

          <hr className="rule-quiet mt-6 mb-6" />

          <LeadCaptureForm source="modal" onClose={onClose} />
        </div>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-labelledby={barTitleId}
      className={[
        'fixed inset-x-0 bottom-0 z-50 rounded-t-panel border-t border-gold bg-paper-2 shadow-panel transition-transform duration-300 md:hidden',
        shown ? 'translate-y-0' : 'translate-y-full',
      ].join(' ')}
      style={{
        transitionTimingFunction: 'var(--ease-page)',
        // Never sits under the home indicator or the browser chrome.
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* A hard hairline above the bar rather than a soft grey blur, the way a
          running foot is ruled off from the text block. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0.5 h-px bg-paper-3"
      />

      <div className="relative flex min-h-28 items-center gap-4 py-4 pl-5 pr-14">
        <button
          ref={openButtonRef}
          type="button"
          aria-haspopup="dialog"
          onClick={() => setExpanded(true)}
          className="flex flex-1 items-center gap-4 text-left"
        >
          <Seal size={40} />
          <span className="min-w-0">
            <span
              id={barTitleId}
              className="block font-display text-h4 text-ink"
            >
              {leadOffer.barTitle}
            </span>
            <span className="mt-1 block text-fine text-ink-soft">
              {leadOffer.barLine}
            </span>
          </span>
        </button>

        <PanelCloseButton
          onClose={onClose}
          label="Dismiss this offer"
          className="absolute right-1 top-1"
        />
      </div>
    </div>
  )
}
