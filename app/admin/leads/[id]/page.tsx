import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { leadStatuses, statusLabels } from '@/lib/lead-schema'
import { resendLeadMail, updateLead } from '@/app/admin/actions'
import { NoDatabase, StatusBadge, formatDate, sourceLabels, stageLabel } from '@/app/admin/ui'

/**
 * One enquiry, in full, and the three things you can do to it: move its
 * status, keep a note against it, and send yourself the notification again.
 *
 * All of that is plain forms posting to server actions. No client component
 * appears on this page at all, which means the whole thing works before any
 * JavaScript loads and there is no state to get out of step with the row.
 */
export const dynamic = 'force-dynamic'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-paper-3 py-3 sm:grid sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-fine uppercase tracking-[0.1em] text-ink-soft">{label}</dt>
      <dd className="mt-1 break-words text-small text-ink sm:mt-0">{children}</dd>
    </div>
  )
}

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = await getDb()

  if (!db) return <NoDatabase />

  const lead = await db.lead.findUnique({ where: { id } })
  if (!lead) notFound()

  return (
    <>
      <Link href="/admin" className="text-fine text-ink-soft no-underline hover:text-ink">
        Back to all enquiries
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-h3 tracking-tight">
          {lead.name || 'No name given'}
        </h1>
        <StatusBadge status={lead.status} />
      </div>

      <p className="mt-1 text-small text-ink-soft">
        Received {formatDate(lead.createdAt)} UTC, through the{' '}
        {sourceLabels[lead.source].toLowerCase()}.
      </p>

      {/*
        The reply controls first, above the detail. Reading an enquiry is not
        the job; answering it is, and since nothing here answers the author for
        you, their address and their number are the first thing you need rather
        than something to scroll for.
      */}
      <div className="mt-5 flex flex-wrap gap-2">
        <a
          href={`mailto:${lead.email}`}
          className="rounded-md bg-bark px-4 py-2 text-small text-paper no-underline transition-opacity hover:opacity-90"
        >
          Email {lead.email}
        </a>
        {lead.phone ? (
          <a
            href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
            className="rounded-md border border-paper-3 bg-paper px-4 py-2 text-small text-ink no-underline transition-colors hover:border-ink-soft"
          >
            Call {lead.phone}
          </a>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div>
          <dl>
            <Field label="Email">
              <a href={`mailto:${lead.email}`} className="text-teal no-underline hover:underline">
                {lead.email}
              </a>
            </Field>
            <Field label="Phone">{lead.phone || 'Not given'}</Field>
            <Field label="Country">{lead.country || 'Not given'}</Field>
            <Field label="Stage">{stageLabel(lead.stage)}</Field>
            <Field label="Genre">{lead.genre || 'Not given'}</Field>
            <Field label="Word count">
              {lead.wordCount === null ? 'Not given' : lead.wordCount.toLocaleString('en-US')}
            </Field>
            <Field label="Budget">{lead.budget || 'Not given'}</Field>
            <Field label="Page">{lead.path || 'Not recorded'}</Field>
            <Field label="Referrer">{lead.referrer || 'Direct or not recorded'}</Field>
            {/*
              The user agent is kept because it is occasionally the only way to
              tell a real submission from an automated one, and shown small
              because it is never the thing you came here to read.
            */}
            <Field label="Browser">
              <span className="text-fine text-ink-soft">
                {lead.userAgent || 'Not recorded'}
              </span>
            </Field>
          </dl>

          <h2 className="mt-8 font-display text-h4">What they wrote</h2>
          {lead.message ? (
            <p className="mt-2 whitespace-pre-wrap rounded-lg border border-paper-3 bg-paper-2 p-4 text-small text-ink">
              {lead.message}
            </p>
          ) : (
            <p className="mt-2 text-small text-ink-soft">
              Nothing. This form did not ask for a message.
            </p>
          )}
        </div>

        <aside className="space-y-6">
          {/* Status. One form per button, so this needs no JavaScript. */}
          <section>
            <h2 className="font-display text-h4">Status</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {leadStatuses.map((status) => (
                <form key={status} action={updateLead}>
                  <input type="hidden" name="id" value={lead.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={lead.status === status}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-fine transition-colors disabled:cursor-default ${
                      lead.status === status
                        ? 'border-ink bg-bark text-paper'
                        : 'border-paper-3 bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
                    }`}
                  >
                    {statusLabels[status]}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-h4">Your notes</h2>
            <form action={updateLead} className="mt-2">
              <input type="hidden" name="id" value={lead.id} />
              <textarea
                name="notes"
                rows={7}
                defaultValue={lead.notes ?? ''}
                placeholder="What was said on the call, what they need, what you promised."
                className="w-full resize-y rounded-md border border-paper-3 bg-paper px-3 py-2 text-small text-ink outline-none focus:border-ink-soft"
              />
              <button
                type="submit"
                className="mt-2 w-full cursor-pointer rounded-md border border-paper-3 bg-paper-2 px-4 py-2 text-small text-ink transition-colors hover:border-ink-soft"
              >
                Save notes
              </button>
            </form>
            <p className="mt-1.5 text-fine text-ink-soft">
              Only ever seen here. Nothing on this page is emailed to the author.
            </p>
          </section>

          <section>
            <h2 className="font-display text-h4">Notification</h2>
            <p className="mt-2 text-small">
              {lead.notifiedAt
                ? `Emailed to you ${formatDate(lead.notifiedAt)} UTC.`
                : 'Never reached your inbox.'}
            </p>
            <form action={resendLeadMail} className="mt-1">
              <input type="hidden" name="id" value={lead.id} />
              <button type="submit" className="cursor-pointer text-fine text-teal underline">
                {lead.notifiedAt ? 'Send it again' : 'Send it now'}
              </button>
            </form>
            <p className="mt-2 text-fine text-ink-soft">
              This goes to you, never to the author. Nothing on this page emails
              them.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
