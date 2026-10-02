/**
 * Sending mail, or not sending it.
 *
 * The one rule this module inherits from POST /api/lead: a lead that reached
 * the server is never told it failed. So nothing here throws and nothing here
 * is awaited in a way that can turn a mail problem into a form error. Every
 * function returns a boolean and logs the reason when that boolean is false.
 *
 * There are two ways out, tried in that order:
 *
 *   SMTP, when SMTP_HOST, SMTP_USER and SMTP_PASS are set. The site signs in
 *   to a mailbox you already own and sends as itself, so the notification
 *   never passes through anybody's API and needs no domain verification. This
 *   is the one to use when the enquiry should land in a mailbox you read.
 *
 *   Resend, when RESEND_API_KEY is set and SMTP is not. An HTTPS POST, which
 *   survives hosts that block outbound port 587, and which needs the sending
 *   domain verified before it will send as that domain.
 *
 * With neither configured, every send is skipped and logged. The site still
 * works: forms submit, rows are written, no mail goes out. That is the same
 * degradation lib/db.ts makes for the database.
 *
 * Resend is called over its REST API with plain fetch rather than through its
 * SDK, because one authenticated POST does not justify a dependency. SMTP gets
 * nodemailer, because SMTP is a stateful conversation over a socket with TLS
 * upgrades and auth negotiation in it, and hand rolling that is how you get a
 * mail path that works until the day a provider changes a greeting.
 */

import { createTransport, type Transporter } from 'nodemailer'

import { site } from '@/lib/site'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/** True when there is enough configuration to open an SMTP session. */
function smtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  )
}

/**
 * Who the mail is from.
 *
 * The default differs by transport, because the two have different rules about
 * it. Resend will send as any address on a domain you have verified, so the
 * site's own address is right. An SMTP provider will generally only let you
 * send as the mailbox you authenticated with, or an alias of it: Gmail rewrites
 * anything else, and others reject it outright. So the SMTP default is the user
 * we signed in as, which is always allowed.
 *
 * MAIL_FROM overrides both. On SMTP, set it only to an address that mailbox is
 * actually permitted to send as.
 */
function fromAddress(): string {
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM
  if (smtpConfigured()) return `${site.name} <${process.env.SMTP_USER}>`
  return `${site.name} <${site.email}>`
}

/** Where lead notifications go. Your inbox, not the author's.
 *
 * This is site.email, the one address the contact page, the footer and the
 * JSON-LD already show, because an enquiry should arrive at the mailbox
 * visitors are told to write to. lib/site.ts is the single place it changes.
 *
 * A real default rather than a fallback to MAIL_FROM: MAIL_FROM is a from
 * address, constrained by what the transport will let you send as, and it is
 * not necessarily a mailbox anybody reads. Set LEAD_NOTIFY_TO to send the
 * notifications somewhere else without touching either file.
 */
export const DEFAULT_NOTIFY_TO = site.email

export function notifyAddress(): string {
  return process.env.LEAD_NOTIFY_TO?.trim() || DEFAULT_NOTIFY_TO
}

/**
 * A subject line with no line breaks in it.
 *
 * A subject is built from a name typed into a public form, and a name
 * containing a carriage return is how header injection is attempted: the rest
 * of the value would be read as a new header, a Bcc among them. Resend takes
 * JSON and nodemailer encodes its own headers, so this is a second line of
 * defence rather than the only one, and it costs one replace.
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
 * The SMTP connection, made once and kept.
 *
 * Opening a socket, upgrading it to TLS and authenticating costs more than
 * sending the message does, so a long lived container should pay it once. The
 * pool is capped at one connection because this sends one mail per enquiry and
 * a mail provider counts simultaneous connections against you.
 *
 * Cached at module scope, which means per instance: a new container opens its
 * own. That is correct, and it is also why this must never be awaited at import
 * time, only on the first send.
 */
let transporter: Transporter | null = null

function smtpTransport(): Transporter {
  if (transporter) return transporter

  const port = Number(process.env.SMTP_PORT || 587)

  transporter = createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is TLS from the first byte. Everything else starts in the clear and
    // upgrades with STARTTLS, which `secure: false` means here rather than
    // "unencrypted": requireTLS makes the upgrade mandatory, so a provider
    // that fails to offer it is an error instead of a plaintext password.
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 1,
    // A hung mail server must not hold a form submission open.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  })

  return transporter
}

async function sendViaSmtp(mail: Mail): Promise<boolean> {
  try {
    await smtpTransport().sendMail({
      from: fromAddress(),
      to: mail.to,
      subject: oneLine(mail.subject),
      html: mail.html,
      text: mail.text,
      ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
    })

    return true
  } catch (error) {
    // The common three, and all of them say so in the message: a wrong or
    // expired app password (535), a provider that wants an app password rather
    // than the account one, and a host that blocks outbound 587.
    console.error(
      `[mail] SMTP refused "${mail.subject}" to ${mail.to} via ${process.env.SMTP_HOST}:`,
      error,
    )

    // Drop the transport so the next attempt rebuilds it. A pooled connection
    // that has gone bad otherwise fails every send after the first.
    transporter = null
    return false
  }
}

async function sendViaResend(mail: Mail, key: string): Promise<boolean> {
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

/**
 * Sends one email through whichever transport is configured.
 *
 * Returns true only when that transport accepted it, and acceptance is not
 * delivery: a true here means the message was handed over, not that it landed
 * in an inbox, which is why the dashboard shows the timestamp as "notified"
 * rather than as "read". An SMTP true is the stronger of the two, because the
 * receiving server accepted the recipient during the session.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  if (smtpConfigured()) return sendViaSmtp(mail)

  const key = process.env.RESEND_API_KEY
  if (key) return sendViaResend(mail, key)

  console.warn(
    `[mail] Neither SMTP_HOST/SMTP_USER/SMTP_PASS nor RESEND_API_KEY is set, so nothing was sent. Would have sent "${mail.subject}" to ${mail.to}.`,
  )
  return false
}
