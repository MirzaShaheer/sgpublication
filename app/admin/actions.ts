'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  passwordMatches,
} from '@/lib/admin-auth'
import { requireSession } from '@/lib/admin-session'
import { getDb, type LeadRow } from '@/lib/db'
import { leadStatuses, type LeadStatusValue } from '@/lib/lead-schema'
import { leadNotification } from '@/lib/lead-emails'
import { notifyAddress, sendMail } from '@/lib/mail'

/**
 * Everything the dashboard can do, which is deliberately four things: sign in,
 * sign out, change a lead's status or notes, and send yourself the
 * notification again when it did not go out the first time.
 *
 * Nothing here emails the author. The only address the site ever writes to is
 * your own, and answering an enquiry is a thing a person does by hand.
 *
 * There is no delete. A lead is the record of someone who asked for help, and
 * one mis-click should not be able to remove one. Marking a lead closed says
 * the same thing and can be undone.
 */

/**
 * Failed sign in attempts: five per address per fifteen minutes.
 *
 * The lead route's limiter guards against a noisy client. This one guards a
 * password, so it is stricter, and it counts only failures. Getting it right
 * repeatedly, which is what your own browser does, is never throttled. Per
 * instance like the other one, and worth replacing with a shared store if this
 * ever runs on more than one container.
 */
const ATTEMPT_WINDOW_MS = 15 * 60_000
const MAX_ATTEMPTS = 5
const attempts = new Map<string, { count: number; resetAt: number }>()

function tooManyAttempts(ip: string): boolean {
  const entry = attempts.get(ip)
  if (!entry || Date.now() > entry.resetAt) return false
  return entry.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return
  }
  entry.count += 1
}

async function clientIp(): Promise<string> {
  const list = await headers()
  const forwarded = list.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return list.get('x-real-ip') ?? 'unknown'
}

/**
 * A path this application will actually serve, or null.
 *
 * The login form carries where the visitor was headed, so signing in lands
 * there. That value arrives in a query string, which means it arrives from
 * whoever wrote the link, so it is checked rather than trusted: it must begin
 * with /admin, and must not begin with a double slash or contain a backslash,
 * either of which some browsers read as the start of a host and would turn
 * this into an open redirect pointing at somebody else's site.
 */
function safeNext(value: string | null | undefined): string | null {
  if (!value) return null
  if (!value.startsWith('/admin')) return null
  if (value.startsWith('//') || value.includes('\\')) return null
  return value
}

export type SignInState = { error?: string }

export async function signIn(
  _previous: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const ip = await clientIp()

  if (tooManyAttempts(ip)) {
    return { error: 'Too many attempts. Try again in fifteen minutes.' }
  }

  const password = String(formData.get('password') ?? '')

  if (!passwordMatches(password)) {
    recordFailure(ip)
    // One message for a blank password and for a wrong one. Telling those two
    // apart is no use to you and is a small gift to anybody else.
    return { error: 'That password is not right.' }
  }

  attempts.delete(ip)

  const jar = await cookies()
  jar.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    // Not readable by script, not sent over plain HTTP in production, and not
    // sent on a cross site request, so a form on another origin cannot act as
    // you. Secure is off in development so this still works on localhost.
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  redirect(safeNext(String(formData.get('next') ?? '')) ?? '/admin')
}

export async function signOut() {
  const jar = await cookies()
  jar.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

function asStatus(value: unknown): LeadStatusValue | null {
  return leadStatuses.includes(value as LeadStatusValue)
    ? (value as LeadStatusValue)
    : null
}

/** Changes a lead's status, its notes, or both. */
export async function updateLead(formData: FormData) {
  await requireSession()

  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('No lead given.')

  const db = await getDb()
  if (!db) throw new Error('No database is configured.')

  const data: { status?: LeadStatusValue; notes?: string | null } = {}

  const status = asStatus(formData.get('status'))
  if (status) data.status = status

  if (formData.has('notes')) {
    const notes = String(formData.get('notes') ?? '').trim()
    // An emptied box stores nothing rather than an empty string, which is what
    // the form schema does with every other optional field.
    data.notes = notes ? notes.slice(0, 8000) : null
  }

  if (Object.keys(data).length === 0) return

  await db.lead.update({ where: { id }, data })

  revalidatePath('/admin')
  revalidatePath(`/admin/leads/${id}`)
}

/**
 * A stored row in the shape the email builder wants.
 *
 * It takes a parsed form payload, where an absent value is undefined. A row
 * out of Postgres uses null. This is the one seam between the two.
 */
function rowAsPayload(lead: LeadRow) {
  return {
    name: lead.name ?? '',
    email: lead.email,
    phone: lead.phone ?? '',
    country: lead.country ?? undefined,
    stage: lead.stage,
    genre: lead.genre ?? undefined,
    wordCount: lead.wordCount ?? undefined,
    budget: lead.budget ?? undefined,
    message: lead.message ?? undefined,
    source: lead.source,
    path: lead.path ?? undefined,
    referrer: lead.referrer ?? undefined,
    company: undefined,
  }
}

/**
 * Sends the notification to you again.
 *
 * This is why the row records when it went out. A Resend key added an hour
 * late, a DNS record not yet propagated, a typo in the from address: each one
 * leaves a real lead sitting in the table that you were never told about, and
 * each one is put right by pressing this once.
 *
 * It only ever writes to your own address. There is no branch here that could
 * send anything to the author.
 */
export async function resendLeadMail(formData: FormData) {
  await requireSession()

  const id = String(formData.get('id') ?? '')
  if (!id) throw new Error('No lead given.')

  const db = await getDb()
  if (!db) throw new Error('No database is configured.')

  const notifyTo = notifyAddress()
  if (!notifyTo) throw new Error('No LEAD_NOTIFY_TO or MAIL_FROM is set.')

  const lead = await db.lead.findUnique({ where: { id } })
  if (!lead) throw new Error('That lead no longer exists.')

  const sent = await sendMail(leadNotification({ ...rowAsPayload(lead), id }, notifyTo))
  if (sent) await db.lead.update({ where: { id }, data: { notifiedAt: new Date() } })

  revalidatePath(`/admin/leads/${id}`)
}
