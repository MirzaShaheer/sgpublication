/**
 * Sending mail, or not sending it.
 *
 * The one rule this module inherits from POST /api/lead: a lead that reached
 * the server is never told it failed. So nothing here throws and nothing here
 * is awaited in a way that can turn a mail problem into a form error. Every
 * function returns a boolean and logs the reason when that boolean is false.
 *
 * Resend is called over its REST API with plain fetch rather than through its
 * SDK. One authenticated POST does not justify a fifth dependency in a project
 * that runs on four, and a missing dependency is one more thing that can break
 * a build the same way a missing Prisma client can.
 *
 * With no RESEND_API_KEY set, every send is skipped and logged. The site works
 * exactly as it does now: forms submit, rows are written, no mail goes out.
 * That is the same degradation lib/db.ts makes for the database.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/**
 * Who the mail is from. Must be an address on a domain verified in Resend, or
 * Resend rejects the send with a 403. The display name is part of the value so
 * it can be changed without touching this file.
 */
function fromAddress(): string {
  return process.env.MAIL_FROM || 'SG Publication <contact@sgpublication.com>'
}

/** Where lead notifications go. Your inbox, not the author's. */
export function notifyAddress(): string | null {
  return process.env.LEAD_NOTIFY_TO || process.env.MAIL_FROM || null
}

/**
 * A subject line with no line breaks in it.
 *
 * A subject is built from a name typed into a public form, and a name
 * containing a carriage return is how header injection is attempted: the rest
 * of the value would be read as a new header, a Bcc among them. Resend takes
 * JSON and encodes the headers itself, so this is a second line of defence
 * rather than the only one, and it costs one replace.
 */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim().slice(0, 200)
}

export type Mail = {
  to: string
  subject: string
  html: string
  text: string
  /** Set to the author's address on a notification, so reply just works. */
  replyTo?: string
}

/**
 * Sends one email. Returns true only when Resend accepted it.
 *
 * Acceptance is not delivery. A true here means the message is queued, not
 * that it landed in an inbox, which is why the dashboard shows the timestamp
 * as "notified" rather than as "read".
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY

  if (!key) {
    console.warn(
      `[mail] No RESEND_API_KEY set, so nothing was sent. Would have sent "${mail.subject}" to ${mail.to}.`,
    )
    return false
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [mail.to],
        subject: oneLine(mail.subject),
        html: mail.html,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
      // A hung mail provider must not hold a form submission open.
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      // Read the body for the reason. Resend explains itself well: an
      // unverified domain, a malformed from address, a revoked key.
      const detail = await response.text().catch(() => '')
      console.error(
        `[mail] Resend refused "${mail.subject}" to ${mail.to}: ${response.status} ${detail}`,
      )
      return false
    }

    return true
  } catch (error) {
    console.error(`[mail] Send failed for "${mail.subject}" to ${mail.to}:`, error)
    return false
  }
}
