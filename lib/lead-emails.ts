import { stageChoices, type LeadPayload } from '@/lib/lead-schema'
import { absoluteUrl } from '@/lib/site'
import type { Mail } from '@/lib/mail'

/**
 * The one email a submission produces: the notification to you.
 *
 * Built here rather than in the API route so the route stays about receiving a
 * lead, and so this can be rendered and read without a request.
 *
 * Nothing is sent to the author. An enquiry is answered by a person, and an
 * automated "we have your enquiry" arriving a second after they pressed the
 * button is a thing the rest of this site is written to avoid. The on page
 * confirmation already told them it worked.
 *
 * Every value that came from the visitor goes through escapeHtml before it
 * reaches the HTML body. A name is not markup, and an author who types an
 * angle bracket into their message must not be able to change the shape of
 * the mail you read. The text body needs no escaping and is not decoration:
 * it is what a plain text client shows, and a message with no text part is
 * scored as spam by most filters.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** The label a person would recognise, rather than the enum member. */
function stageLabel(stage: LeadPayload['stage']): string {
  if (stage === 'unknown') return 'Not given'
  return stageChoices.find((choice) => choice.value === stage)?.label ?? stage
}

const sourceLabels: Record<LeadPayload['source'], string> = {
  modal: 'Hero form or pop up',
  exit: 'Exit intent',
  inline: 'In page form',
  contact: 'Contact page',
}

const wrap = (title: string, body: string) => `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f4ef;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#1c1917;line-height:1.55">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e7e2d8;border-radius:10px">
<tr><td style="padding:28px 32px">
<p style="margin:0 0 20px;font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#8a8378">${escapeHtml(title)}</p>
${body}
</td></tr></table>
</body></html>`

/**
 * The notification to you.
 *
 * Reply-To is the author's address, so hitting reply in your mail client
 * answers the author and not this mailbox. That one header is the difference
 * between a notification you act on and one you copy an address out of.
 */
export function leadNotification(
  lead: LeadPayload & { id?: string },
  notifyTo: string,
): Mail {
  const rows: [string, string | undefined][] = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Country', lead.country],
    ['Stage', stageLabel(lead.stage)],
    ['Genre', lead.genre],
    ['Word count', lead.wordCount ? lead.wordCount.toLocaleString('en-US') : undefined],
    ['Budget', lead.budget],
    ['Came from', sourceLabels[lead.source]],
    ['Page', lead.path],
    ['Referrer', lead.referrer],
  ]

  const present = rows.filter((row): row is [string, string] => Boolean(row[1]))

  const htmlRows = present
    .map(
      ([label, value]) =>
        `<tr><td style="padding:7px 16px 7px 0;color:#8a8378;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(
          label,
        )}</td><td style="padding:7px 0;font-size:14px;vertical-align:top">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const htmlMessage = lead.message
    ? `<p style="margin:24px 0 6px;font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#8a8378">What they wrote</p>
<div style="white-space:pre-wrap;font-size:14px;padding:14px 16px;background:#f6f4ef;border-radius:8px">${escapeHtml(
        lead.message,
      )}</div>`
    : ''

  const dashboard = lead.id
    ? `<p style="margin:26px 0 0"><a href="${absoluteUrl(
        `/admin/leads/${lead.id}`,
      )}" style="display:inline-block;padding:11px 18px;background:#1c1917;color:#ffffff;text-decoration:none;border-radius:7px;font-size:14px">Open this lead</a></p>`
    : ''

  const who = lead.name || lead.email

  const textLines = present.map(([label, value]) => `${label}: ${value}`)
  if (lead.message) textLines.push('', 'What they wrote:', lead.message)
  if (lead.id) textLines.push('', absoluteUrl(`/admin/leads/${lead.id}`))

  return {
    to: notifyTo,
    // The name and stage in the subject means the inbox list alone tells you
    // who this is and how warm they are, without opening anything.
    subject: `New enquiry: ${who} (${stageLabel(lead.stage)})`,
    replyTo: lead.email,
    html: wrap(
      'New enquiry',
      `<h1 style="margin:0 0 18px;font-size:21px;font-weight:600">${escapeHtml(who)}</h1>
<table role="presentation" cellpadding="0" cellspacing="0">${htmlRows}</table>${htmlMessage}${dashboard}
<p style="margin:24px 0 0;font-size:12px;color:#8a8378">Reply to this email and it goes straight to the author.</p>`,
    ),
    text: `New enquiry from ${who}\n\n${textLines.join(
      '\n',
    )}\n\nReply to this email and it goes straight to the author.`,
  }
}
