import { getDb } from '@/lib/db'
import { isSignedIn } from '@/lib/admin-session'
import { buildWhere } from '@/app/admin/filters'
import { statusLabels } from '@/lib/lead-schema'
import { sourceLabels, stageLabel } from '@/app/admin/ui'

/**
 * GET /admin/export
 *
 * The current view as a CSV, honouring the same filters as the table, so what
 * downloads is what you were looking at rather than always everything.
 *
 * It sits under /admin so middleware guards it, and it checks the session
 * again for itself, because this one response is the entire lead list in a
 * single file and is the last endpoint that should depend on a matcher pattern
 * being right.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * One CSV cell.
 *
 * Quoted whenever it contains a comma, a quote or a newline, with inner quotes
 * doubled, which is the whole of RFC 4180 that matters here.
 *
 * The leading apostrophe on a value starting with =, +, - or @ is not
 * cosmetic: Excel and Sheets treat such a cell as a formula, so a name typed
 * into a public form on the internet is otherwise a way to run something in
 * your spreadsheet. The apostrophe makes it text and is not displayed.
 */
function cell(value: unknown): string {
  if (value === null || value === undefined) return ''

  let text = value instanceof Date ? value.toISOString() : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`

  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const COLUMNS = [
  'Received (UTC)',
  'Name',
  'Email',
  'Phone',
  'Country',
  'Stage',
  'Genre',
  'Word count',
  'Budget',
  'Form',
  'Page',
  'Referrer',
  'Status',
  'Notified you',
  'Your notes',
  'Message',
]

export async function GET(request: Request) {
  if (!(await isSignedIn())) {
    return new Response('Not signed in.', { status: 401 })
  }

  const db = await getDb()
  if (!db) return new Response('No database is configured.', { status: 503 })

  const params = new URL(request.url).searchParams
  const where = buildWhere({
    status: params.get('status') ?? undefined,
    source: params.get('source') ?? undefined,
    q: params.get('q') ?? undefined,
  })

  // Every matching row, not one page of them: the point of an export is to
  // have the lot. Capped so a runaway table cannot exhaust memory here.
  const rows = await db.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10_000,
  })

  const body = [
    COLUMNS.join(','),
    ...rows.map((lead) =>
      [
        lead.createdAt.toISOString(),
        lead.name,
        lead.email,
        lead.phone,
        lead.country,
        stageLabel(lead.stage),
        lead.genre,
        lead.wordCount,
        lead.budget,
        sourceLabels[lead.source],
        lead.path,
        lead.referrer,
        statusLabels[lead.status],
        lead.notifiedAt,
        lead.notes,
        lead.message,
      ]
        .map(cell)
        .join(','),
    ),
  ].join('\r\n')

  const today = new Date().toISOString().slice(0, 10)

  return new Response(
    // A byte order mark, so Excel on Windows opens this as UTF-8 rather than
    // turning every accented name in it into mojibake.
    `﻿${body}`,
    {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="sg-leads-${today}.csv"`,
        'cache-control': 'no-store',
        'x-robots-tag': 'noindex, nofollow',
      },
    },
  )
}
