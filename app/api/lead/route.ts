import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import {
  isHoneypotFilled,
  leadFieldErrors,
  leadSchema,
  toLeadRecord,
  type LeadPayload,
} from '@/lib/lead-schema'

/**
 * POST /api/lead
 *
 * Four deliberate behaviours, all of them about never losing a lead:
 *
 *   1. No DATABASE_URL means the payload is logged and the route still answers
 *      { ok: true }. Local development never needs Postgres.
 *   2. A failed write still answers { ok: true }. A lead that reached the
 *      server is never told it failed. The error is ours to fix, not the
 *      author's to worry about, so it goes to the log and no further.
 *   3. A filled honeypot answers { ok: true } and writes nothing, so a bot
 *      believes it succeeded and does not come back in a different shape.
 *   4. Nothing the visitor submitted is echoed back in any response.
 */

// Prisma needs the Node runtime.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * A light in memory rate limit: five submissions a minute from one address.
 * This is PER INSTANCE only. A deployment running several containers or
 * several serverless instances wants a shared store such as Redis or Upstash
 * for this to mean anything. It exists to blunt a single noisy client, not to
 * be a real defence.
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    // Opportunistic sweep, so the map cannot grow without bound.
    if (hits.size > 5000) {
      for (const [key, value] of hits) {
        if (now > value.resetAt) hits.delete(key)
      }
    }
    return false
  }

  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * In development the lead is printed as a readable block, so a developer with
 * no database can still see exactly what arrived.
 */
function logLead(payload: LeadPayload, stored: boolean) {
  if (process.env.NODE_ENV === 'production') return

  const lines: [string, string | number | undefined][] = [
    ['source', payload.source],
    ['stage', payload.stage],
    ['name', payload.name],
    ['email', payload.email],
    ['phone', payload.phone],
    ['country', payload.country],
    ['genre', payload.genre],
    ['word count', payload.wordCount],
    ['budget', payload.budget],
    ['page', payload.path],
    ['referrer', payload.referrer],
  ]

  const body = lines
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([label, value]) => `  ${label.padEnd(11)} ${String(value)}`)
    .join('\n')

  const message = payload.message
    ? `\n  message\n${payload.message
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n')}`
    : ''

  console.info(
    `\n=== NEW LEAD (${stored ? 'stored' : 'not stored, no database'}) ===\n${body}${message}\n`,
  )
}

export async function POST(request: Request) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: 'Too many submissions. Please try again in a minute.' },
      { status: 429 },
    )
  }

  // A body that is not JSON is a 400, not a thrown request.
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'That request could not be read.' },
      { status: 400 },
    )
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, errors: leadFieldErrors(parsed.error) },
      { status: 400 },
    )
  }

  const payload = parsed.data

  // The honeypot: answer as though it worked, write nothing at all.
  if (isHoneypotFilled(payload)) {
    return NextResponse.json({ ok: true })
  }

  const record = toLeadRecord(payload, {
    path: payload.path,
    referrer: payload.referrer ?? request.headers.get('referer') ?? undefined,
    userAgent: request.headers.get('user-agent') ?? undefined,
  })

  try {
    const db = await getDb()

    if (!db) {
      logLead(payload, false)
      if (process.env.NODE_ENV === 'production') {
        console.warn('[lead] No database configured. Lead received and not stored.')
      }
      return NextResponse.json({ ok: true })
    }

    await db.lead.create({ data: record })
    logLead(payload, true)
  } catch (error) {
    // The write failed. The visitor still gets { ok: true }, because a lead
    // that reached this server should never be told it failed. We have the
    // details in the log and can recover it by hand.
    console.error('[lead] Write failed. Lead received and not stored:', error)
    console.error('[lead] Recoverable payload:', {
      email: record.email,
      name: record.name,
      phone: record.phone,
      stage: record.stage,
      source: record.source,
    })
  }

  return NextResponse.json({ ok: true })
}
