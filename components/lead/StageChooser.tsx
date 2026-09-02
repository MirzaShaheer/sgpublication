'use client'

import type { LeadStage } from '@/components/lead/LeadProvider'

/**
 * Step one of the lead form.
 *
 * One question, four answers, and no typing. Naming where you are is something
 * a first time author can do without committing to anything, and answering it
 * is what earns the right to ask for an email on step two.
 *
 * These are real buttons rather than radio inputs on purpose. Choosing an
 * option advances the form immediately, and inside a radio group the arrow
 * keys change the selection, so a keyboard user exploring the options would be
 * thrown forward on every press. Buttons move on Tab and only act on Enter or
 * Space, which is the behaviour this flow needs.
 *
 * They are set as wide ruled rows, the way a contents page rules its entries,
 * not as four rounded cards.
 */

export type StageOption = {
  value: Exclude<LeadStage, 'unknown'>
  label: string
  hint: string
}

export const stageOptions: StageOption[] = [
  {
    value: 'idea',
    label: 'I have an idea',
    hint: 'Nothing written yet, or notes and talks you have never pulled together.',
  },
  {
    value: 'writing',
    label: 'I am partway through writing',
    hint: 'A draft exists. It might be a third of a book or nine tenths of one.',
  },
  {
    value: 'manuscript_finished',
    label: 'My manuscript is finished',
    hint: 'It needs editing, a cover, and to be put on sale properly.',
  },
  {
    value: 'published_not_selling',
    label: 'My book is published and not selling',
    hint: 'It is out there. Almost nobody is buying it.',
  },
]

export function StageChooser({
  value,
  onChange,
  compact = false,
}: {
  value: LeadStage | null
  onChange: (stage: LeadStage) => void
  /**
   * Four rows at the roomy setting are 296px, which is most of a capped
   * panel. This trims the padding, not the target: min-h-13 is 52px, still
   * clear of the 44px a touch target has to be.
   */
  compact?: boolean
}) {
  return (
    <ul className="border-t border-paper-3">
      {stageOptions.map((option) => {
        const chosen = value === option.value
        return (
          <li key={option.value} className="border-b border-paper-3">
            <button
              type="button"
              aria-pressed={chosen}
              onClick={() => onChange(option.value)}
              className={[
                'flex w-full items-start gap-3.5 rounded-control px-2.5 text-left transition-colors duration-200 hover:bg-paper-2',
                compact ? 'min-h-13 py-2.5' : 'min-h-14 py-3.5',
              ].join(' ')}
            >
              {/* A ballot box, not a pill: the corner is eased by the same
                  3px the rest of the site eases its smallest objects, and gold
                  is an edge rather than a fill until this row is chosen. */}
              <span
                aria-hidden="true"
                className={[
                  'mt-[0.3rem] block h-3.5 w-3.5 shrink-0 rounded-[3px] border transition-colors duration-200',
                  chosen ? 'border-gold-ink bg-gold-ink' : 'border-gold',
                ].join(' ')}
              />
              <span className="min-w-0">
                <span className="block font-display text-h4 text-ink">
                  {option.label}
                </span>
                <span className="mt-1 block text-fine text-ink-soft">
                  {option.hint}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
