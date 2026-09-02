'use client'

import { useEffect, useId, useState } from 'react'
import { Seal } from '@/components/brand/Seal'
import {
  LeadCaptureForm,
  PanelCloseButton,
  leadOffer,
  useOverlayPanel,
  type LeadView,
} from '@/components/lead/LeadFields'

/**
 * The timed prompt on 768px and wider. The provider decides when it opens; this
 * file is its appearance and its keyboard behaviour.
 *
 * Not a centred white box with rounded corners and a grey blur. The panel is
 * the same uncoated paper as the page, stamped with a gold hairline inside its
 * edge the way foil sits on a case, with the seal at the top and a display
 * serif headline under it. The backdrop is a wash of bark rather than black,
 * and the lift is a hard offset shadow, the way a label sits proud of the
 * board it is glued to, not a soft cloud.
 *
 * SHAPE. The panel is a column of three parts, not one scrolling block:
 *
 *   header   the offer, fixed
 *   body     the questions, takes the slack, scrolls only if it must
 *   foot     the action, fixed, rendered by the form
 *
 * It used to be a single overflow-y-auto box, and on a 1440x800 laptop that
 * put 457px of the filled in form below the fold with the submit button among
 * it, clipped the seal against the top edge, carried the close button out of
 * view on the first scroll, and dragged the inset hairline through the middle
 * of the phone row because the hairline was positioned against the scrolling
 * content rather than the frame. All four are the same mistake, and splitting
 * the column fixes all four.
 *
 * It is also wider than it was: 46rem rather than 34rem. A capture form is two
 * columns of short fields, and at 34rem those columns were 218px each and the
 * panel stood taller than it was wide. Landscape reads as a dialog; portrait
 * reads as a page someone has cut a hole in the site for.
 *
 * Nothing renders until it opens, so it costs nothing on first paint. The
 * `hidden md:flex` guard is belt and braces on top of the provider: even
 * mid resize this panel cannot paint on a small screen, which is the whole
 * point of having a separate mobile treatment.
 */
export function LeadModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const titleId = useId()
  const panelRef = useOverlayPanel(open, onClose)

  /* The form tells us which step it is on so the header can get out of its
     way. The seal and the twenty page pitch are what sell the offer, and they
     have done that job by the time someone has answered the stage question;
     leaving them up costs about 190px of a capped panel to re-read a pitch
     already accepted. Past step one the header is a title bar. */
  const [view, setView] = useState<LeadView>('stage')
  const pitching = view === 'stage'

  /* A closed panel unmounts the form but not this component, so without
     this a reopen would paint one frame of the small header before the
     form remounts and says otherwise. */
  useEffect(() => {
    if (!open) setView('stage')
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 hidden items-center justify-center p-6 md:flex">
      {/* Bark at sixty percent. Black would read as a different site. */}
      <div
        role="presentation"
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-bark/60"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex max-h-[86vh] w-full max-w-[46rem] flex-col overscroll-contain rounded-plate border border-gold bg-paper-2 shadow-modal"
      >
        {/* The second hairline, set in from the edge: an imprint page rules
            its block twice, and it is what stops this reading as a box.

            On the frame, not on the scrolling content. That is the whole fix:
            positioned against a box that scrolls, this drew a stray rule
            across the middle of the form. pointer-events-none so it never
            eats a click meant for the close button beneath it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] z-10 rounded-[calc(var(--radius-plate)-7px)] border border-gold/40"
        />

        <PanelCloseButton
          onClose={onClose}
          label="Close this offer"
          className="absolute right-3 top-3 z-20"
        />

        <div
          className={[
            'shrink-0 px-8 sm:px-11',
            pitching ? 'pt-7 sm:pt-8' : 'pt-6',
          ].join(' ')}
        >
          {pitching ? <Seal size={40} /> : null}

          {/* Two lines and a seal while the offer is still being made; one
              line and nothing else once it has been taken. pr-14 is the
              close button's own column, so a long heading never runs under
              it at either size. */}
          <h2
            id={titleId}
            className={
              pitching
                ? 'mt-4 max-w-[24ch] pr-14 text-h3'
                : 'pr-14 text-h4'
            }
          >
            {leadOffer.heading}
          </h2>

          {/* Full width rather than held to a measure. A measure is right for
              a column of running text on a page; here it was wrapping fifty
              words over four lines inside a panel 736px wide, and the panel
              is not a page. */}
          {pitching ? (
            <p className="mt-3 text-small text-ink-soft">{leadOffer.lede}</p>
          ) : null}
        </div>

        {/* The boundary between the fixed head and the part that scrolls.
            Gold past step one, where it doubles as the lead-in rule for the
            form's reply: two rules fifteen pixels apart read as a mistake,
            and the reply reads better led by this one than by its own. */}
        <hr
          className={[
            'mx-8 shrink-0 sm:mx-11',
            pitching ? 'rule-quiet mt-5' : 'rule-gold mt-5',
          ].join(' ')}
        />

        <LeadCaptureForm
          source="modal"
          onClose={onClose}
          panel
          onViewChange={setView}
        />
      </div>
    </div>
  )
}
