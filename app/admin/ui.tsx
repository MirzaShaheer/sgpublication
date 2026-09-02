import {
  stageChoices,
  statusLabels,
  type AuthorStageValue,
  type LeadSourceValue,
  type LeadStatusValue,
} from '@/lib/lead-schema'

/**
 * The small shared vocabulary of the dashboard: how a stage, a source, a
 * status and a date are written, in one place so the list and the detail page
 * cannot come to disagree about any of them.
 */

export const sourceLabels: Record<LeadSourceValue, string> = {
  modal: 'Hero or pop up',
  exit: 'Exit intent',
  inline: 'In page form',
  contact: 'Contact page',
}

export function stageLabel(stage: AuthorStageValue): string {
  if (stage === 'unknown') return 'Not given'
  return stageChoices.find((choice) => choice.value === stage)?.label ?? stage
}

/**
 * Dates are written out rather than shown as "3 days ago".
 *
 * A relative time is friendlier and useless here: deciding whether an enquiry
 * has gone unanswered too long needs the actual day, and so does quoting it
 * back to somebody on a call. UTC is stated because it is stated, rather than
 * silently rendered in whatever zone the server happens to be in.
 */
export function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(value)
}

/**
 * Status as a badge.
 *
 * New is the only one that carries colour, because it is the only one that is
 * a request to do something. Once you have picked a lead up, its status is
 * reference rather than a prompt, and four competing colours in a long table
 * would make none of them mean anything.
 */
const statusStyles: Record<LeadStatusValue, string> = {
  new: 'border-gold bg-gold/15 text-gold-ink',
  contacted: 'border-paper-3 bg-paper-2 text-ink-soft',
  won: 'border-olive bg-olive/15 text-olive-ink',
  lost: 'border-paper-3 bg-paper-2 text-ink-soft/70',
}

export function StatusBadge({ status }: { status: LeadStatusValue }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-fine ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

/**
 * Shown in place of the table when there is no DATABASE_URL.
 *
 * The rest of the site treats a missing database as something to work around
 * quietly. A dashboard cannot: an empty table would read as "no enquiries
 * yet", which is a far worse thing to believe than "not connected".
 */
export function NoDatabase() {
  return (
    <div className="rounded-lg border border-paper-3 bg-paper-2 p-6">
      <h2 className="font-display text-h4">No database is connected</h2>
      <p className="mt-2 max-w-measure text-small text-ink-soft">
        This is not an empty list, it is no list at all. Set{' '}
        <code className="rounded bg-paper px-1 py-0.5 text-fine">DATABASE_URL</code> and
        run <code className="rounded bg-paper px-1 py-0.5 text-fine">
          npx prisma migrate deploy
        </code>
        , then reload. Until then the forms still work and each submission is
        logged by the server and emailed, rather than stored.
      </p>
    </div>
  )
}
