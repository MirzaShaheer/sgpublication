import Link from 'next/link'
import { getDb } from '@/lib/db'
import {
  activeSource,
  activeStatus,
  buildWhere,
  queryWith,
  type Filters,
} from '@/app/admin/filters'
import { leadSources, leadStatuses, statusLabels } from '@/lib/lead-schema'
import { NoDatabase, StatusBadge, formatDate, sourceLabels, stageLabel } from '@/app/admin/ui'

/**
 * Every enquiry the site has taken, newest first.
 *
 * Rendered on the server, which is the point rather than a detail: the rows
 * are turned into HTML before the response leaves, so a table of real people's
 * phone numbers and email addresses never exists as JSON in a client bundle or
 * in a fetch a browser extension could read.
 */
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

function FilterLink({
  filters,
  change,
  active,
  children,
}: {
  filters: Filters
  change: Partial<Filters>
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={`/admin${queryWith(filters, change)}`}
      className={`rounded-full border px-3 py-1 text-fine no-underline transition-colors ${
        active
          ? 'border-ink bg-bark text-paper'
          : 'border-paper-3 bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
      }`}
    >
      {children}
    </Link>
  )
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Filters>
}) {
  const filters = await searchParams
  const db = await getDb()

  if (!db) {
    return (
      <>
        <h1 className="font-display text-h3 tracking-tight">Enquiries</h1>
        <div className="mt-6">
          <NoDatabase />
        </div>
      </>
    )
  }

  const where = buildWhere(filters)
  const page = Math.max(1, Number(filters.page) || 1)

  // The counts are for the filter chips, and they ignore the status filter on
  // purpose: a chip that reported the number of leads matching itself only
  // when already selected would be useless for deciding to select it.
  const countWhere = buildWhere({ ...filters, status: undefined })

  const [total, rows, statusCounts] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    Promise.all(
      leadStatuses.map(async (option) => ({
        status: option,
        count: await db.lead.count({ where: { ...countWhere, status: option } }),
      })),
    ),
  ])

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const status = activeStatus(filters)
  const source = activeSource(filters)

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-h3 tracking-tight">Enquiries</h1>
          <p className="mt-1 text-small text-ink-soft">
            {total.toLocaleString('en-US')}
            {total === 1 ? ' enquiry' : ' enquiries'}
            {status || source || filters.q ? ' matching' : ' in total'}
          </p>
        </div>

        <a
          href={`/admin/export${queryWith(filters, {})}`}
          className="rounded-md border border-paper-3 bg-paper px-3 py-1.5 text-fine text-ink-soft no-underline transition-colors hover:border-ink-soft hover:text-ink"
        >
          Download CSV
        </a>
      </div>

      {/* Search. A plain GET form, so a filtered view is a URL you can keep. */}
      <form action="/admin" method="get" className="mt-6 flex flex-wrap gap-2">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        {source ? <input type="hidden" name="source" value={source} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ''}
          placeholder="Name, email or phone"
          aria-label="Search enquiries"
          className="min-w-56 flex-1 rounded-md border border-paper-3 bg-paper px-3 py-2 text-small text-ink outline-none focus:border-ink-soft"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md border border-paper-3 bg-paper-2 px-4 py-2 text-small text-ink transition-colors hover:border-ink-soft"
        >
          Search
        </button>
        {filters.q ? (
          <Link
            href={`/admin${queryWith(filters, { q: undefined })}`}
            className="self-center text-fine text-ink-soft no-underline hover:text-ink"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterLink filters={filters} change={{ status: undefined }} active={!status}>
          All
        </FilterLink>
        {statusCounts.map((option) => (
          <FilterLink
            key={option.status}
            filters={filters}
            change={{ status: option.status }}
            active={status === option.status}
          >
            {statusLabels[option.status]} {option.count}
          </FilterLink>
        ))}

        <span className="mx-1 h-4 w-px bg-paper-3" aria-hidden />

        <FilterLink filters={filters} change={{ source: undefined }} active={!source}>
          Any form
        </FilterLink>
        {leadSources.map((option) => (
          <FilterLink
            key={option}
            filters={filters}
            change={{ source: option }}
            active={source === option}
          >
            {sourceLabels[option]}
          </FilterLink>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-lg border border-paper-3 bg-paper-2 p-6 text-small text-ink-soft">
          {total === 0 && !filters.q && !status && !source
            ? 'No enquiries yet. The next one to come through any form on the site will appear here.'
            : 'Nothing matches those filters.'}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-paper-3">
          <table className="w-full border-collapse text-small">
            <thead>
              <tr className="bg-paper-2 text-left text-fine uppercase tracking-[0.1em] text-ink-soft">
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Form</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Told you</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-t border-paper-3 align-top transition-colors hover:bg-paper-2"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-ink no-underline hover:text-teal hover:underline"
                    >
                      {lead.name || 'No name given'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    <a href={`mailto:${lead.email}`} className="text-teal no-underline hover:underline">
                      {lead.email}
                    </a>
                    {lead.phone ? (
                      <>
                        <br />
                        <a
                          href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
                          className="text-ink-soft no-underline hover:text-ink"
                        >
                          {lead.phone}
                        </a>
                      </>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{stageLabel(lead.stage)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    {sourceLabels[lead.source]}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} />
                  </td>
                  {/*
                    Whether the notification reached you. A no here is a lead
                    that arrived while the mail was misconfigured, which is
                    worth seeing at a glance rather than discovering later.
                  */}
                  <td className="whitespace-nowrap px-4 py-3 text-fine text-ink-soft">
                    {lead.notifiedAt ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 ? (
        <nav className="mt-6 flex items-center justify-between text-small" aria-label="Pages">
          {page > 1 ? (
            <Link
              href={`/admin${queryWith(filters, { page: String(page - 1) })}`}
              className="text-teal no-underline hover:underline"
            >
              Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink-soft">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={`/admin${queryWith(filters, { page: String(page + 1) })}`}
              className="text-teal no-underline hover:underline"
            >
              Older
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </>
  )
}
