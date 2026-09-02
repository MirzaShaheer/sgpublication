import { z } from 'zod'

/**
 * The one lead payload, shared by the forms, the wire and POST /api/lead.
 *
 * The stage and source values are spelled exactly as the Prisma enums in
 * prisma/schema.prisma, so nothing is translated between the form and the
 * table. The rule everywhere below: be strict about the three fields we need
 * in order to answer an enquiry at all, which are the name, the email address
 * and the phone number, and forgiving about everything else. A first time
 * author filling this in should never be lectured about the format of their
 * word count.
 */

export const leadSources = ['modal', 'exit', 'inline', 'contact'] as const
export type LeadSourceValue = (typeof leadSources)[number]

export const authorStages = [
  'idea',
  'writing',
  'manuscript_finished',
  'published_not_selling',
  'unknown',
] as const
export type AuthorStageValue = (typeof authorStages)[number]

/**
 * The four stages a visitor is offered. `unknown` is the stored default for a
 * form that does not ask, and is never shown as a choice.
 *
 * `reply` is shown at the top of the details step, once the visitor has
 * answered. It makes step two read as a response to what they just said rather
 * than as a second form appearing, and it is the one place on the site where
 * we say plainly that this particular stage is one we are good at.
 *
 * Each reply names a specific capability rather than claiming to be the best:
 * the size of the ghostwriting practice, the structural read, a real
 * timeframe, a free first look. At the exact moment someone is deciding
 * whether to trust us, an unsupported boast reads as the thing the rest of
 * this site is written to avoid, and a checkable specific does the same job
 * better.
 */
export const stageChoices: {
  value: AuthorStageValue
  label: string
  hint: string
  reply: string
}[] = [
  {
    value: 'idea',
    label: 'I have an idea',
    hint: 'Nothing written yet, or notes and talks never pulled together.',
    reply:
      'Good, that is the stage we do most of. More than half the books we publish start with nothing written down, drawn out of you by a named ghostwriter over a series of recorded interviews.',
  },
  {
    value: 'writing',
    label: 'I am partway through writing',
    hint: 'A draft exists, whether that is a third of a book or nine tenths.',
    reply:
      'A part finished draft is the most common thing we are handed. It starts with a structural read: one editor tells you what stays, what moves and what is still missing, before anyone touches a sentence.',
  },
  {
    value: 'manuscript_finished',
    label: 'My manuscript is finished',
    hint: 'It needs editing, a cover, and to be put on sale properly.',
    reply:
      'Then you are on our fastest path. A finished manuscript reaches a book on sale in roughly 8 to 10 weeks, fully edited, designed, and listed on every major store in your name.',
  },
  {
    value: 'published_not_selling',
    label: 'It is published and not selling',
    hint: 'The book is out there. Almost nobody is buying it.',
    reply:
      'We take on a lot of these, and the first look costs nothing. Send us the link and we will tell you whether it is the cover, the categories, the price or the book itself.',
  },
]

/** The reply for a stage, or null where there is nothing to answer. */
export function stageReply(stage: AuthorStageValue | null | undefined) {
  if (!stage || stage === 'unknown') return null
  return stageChoices.find((choice) => choice.value === stage)?.reply ?? null
}

/**
 * Dialling codes for the phone field.
 *
 * Not the full ISO list. Roughly a third of our authors are outside the United
 * States, concentrated in the UK, Canada, Australia, the Gulf and South Asia,
 * so the list covers those properly rather than making someone scroll past two
 * hundred entries to find one. Add a country here when a real enquiry needs
 * one; the value stored is the country name and the dialling code, so nothing
 * downstream has to know about this list.
 *
 * Two entries share +1 on purpose: the United States and Canada are different
 * answers to "where are you", which is what the country is recorded for.
 */
export type DialCode = { code: string; label: string; dial: string }

export const dialCodes: DialCode[] = [
  { code: 'US', label: 'United States', dial: '+1' },
  { code: 'CA', label: 'Canada', dial: '+1' },
  { code: 'GB', label: 'United Kingdom', dial: '+44' },
  { code: 'IE', label: 'Ireland', dial: '+353' },
  { code: 'AU', label: 'Australia', dial: '+61' },
  { code: 'NZ', label: 'New Zealand', dial: '+64' },
  { code: 'AE', label: 'United Arab Emirates', dial: '+971' },
  { code: 'SA', label: 'Saudi Arabia', dial: '+966' },
  { code: 'QA', label: 'Qatar', dial: '+974' },
  { code: 'IN', label: 'India', dial: '+91' },
  { code: 'PK', label: 'Pakistan', dial: '+92' },
  { code: 'BD', label: 'Bangladesh', dial: '+880' },
  { code: 'NG', label: 'Nigeria', dial: '+234' },
  { code: 'KE', label: 'Kenya', dial: '+254' },
  { code: 'GH', label: 'Ghana', dial: '+233' },
  { code: 'ZA', label: 'South Africa', dial: '+27' },
  { code: 'EG', label: 'Egypt', dial: '+20' },
  { code: 'SG', label: 'Singapore', dial: '+65' },
  { code: 'MY', label: 'Malaysia', dial: '+60' },
  { code: 'PH', label: 'Philippines', dial: '+63' },
  { code: 'ID', label: 'Indonesia', dial: '+62' },
  { code: 'JP', label: 'Japan', dial: '+81' },
  { code: 'DE', label: 'Germany', dial: '+49' },
  { code: 'FR', label: 'France', dial: '+33' },
  { code: 'ES', label: 'Spain', dial: '+34' },
  { code: 'IT', label: 'Italy', dial: '+39' },
  { code: 'PT', label: 'Portugal', dial: '+351' },
  { code: 'NL', label: 'Netherlands', dial: '+31' },
  { code: 'BE', label: 'Belgium', dial: '+32' },
  { code: 'CH', label: 'Switzerland', dial: '+41' },
  { code: 'AT', label: 'Austria', dial: '+43' },
  { code: 'PL', label: 'Poland', dial: '+48' },
  { code: 'SE', label: 'Sweden', dial: '+46' },
  { code: 'NO', label: 'Norway', dial: '+47' },
  { code: 'DK', label: 'Denmark', dial: '+45' },
  { code: 'FI', label: 'Finland', dial: '+358' },
  { code: 'BR', label: 'Brazil', dial: '+55' },
  { code: 'MX', label: 'Mexico', dial: '+52' },
  { code: 'AR', label: 'Argentina', dial: '+54' },
]

export const DEFAULT_DIAL_COUNTRY = 'US'

/**
 * The number as it should be stored: dialling code, then the number as typed.
 * Returns undefined for an empty field, so an untouched optional phone stores
 * nothing rather than a bare "+1".
 */
export function formatPhone(country: string, phone: string) {
  const trimmed = phone.trim()
  if (!trimmed) return undefined
  const entry = dialCodes.find((code) => code.code === country)
  return entry ? `${entry.dial} ${trimmed}` : trimmed
}

/** The country name for a dialling code selection. */
export function countryLabel(country: string) {
  return dialCodes.find((code) => code.code === country)?.label
}

/**
 * Budget bands, lined up with the three package prices in content/packages.ts.
 * "I do not know yet" is a real answer and is written as one, because most
 * first time authors have no idea what a book costs and should not have to
 * guess before they are allowed to talk to us.
 */
export const budgetOptions = [
  'Under $200',
  '$200 to $600',
  '$600 to $1,000',
  'Above $1,000',
  'I do not know yet',
] as const

/** Offered as a list, stored as free text, since the list is not exhaustive. */
export const genreOptions = [
  'Business or leadership',
  'Memoir or life story',
  'Self help and personal growth',
  'Health and medicine',
  'Faith and spirituality',
  'Children and young readers',
  'Fiction',
  'Something else',
] as const

/** An empty input should store nothing, not an empty string. */
const optionalText = (max: number, tooLong: string) =>
  z
    .string()
    .trim()
    .max(max, tooLong)
    .optional()
    .transform((value) => (value ? value : undefined))

const blankToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

export const leadSchema = z.object({
  name: z
    .string({ required_error: 'Please tell us your name.' })
    .trim()
    .min(1, 'Please tell us your name.')
    .max(120, 'That name is longer than we can store.'),

  email: z
    .string({ required_error: 'We need an email address to reply to.' })
    .trim()
    .min(1, 'We need an email address to reply to.')
    .max(200, 'That email address is longer than we can store.')
    .email('That does not look like an email address.')
    .toLowerCase(),

  /*
   * Required. An editor answering an enquiry needs a way through when the
   * email bounces or lands in a spam folder, which is where a fair share of
   * our replies end up.
   *
   * Strict about it being there, deliberately loose about its shape: digits,
   * spaces, plus, hyphens and parentheses all pass. International numbers are
   * written a dozen different ways and none of those ways is worth rejecting.
   * An empty string becomes undefined before it is checked, so a blank field
   * is reported as missing rather than as a number that is too short.
   */
  phone: z.preprocess(
    blankToUndefined,
    z
      .string({ required_error: 'Please give us a phone number.' })
      .trim()
      .min(6, 'That phone number looks too short.')
      .max(32, 'That phone number looks too long.')
      .regex(
        /^[0-9+()\s-]+$/,
        'A phone number can use digits, spaces, brackets, a plus and a hyphen.',
      ),
  ),

  country: optionalText(80, 'That country name is longer than we can store.'),

  stage: z.enum(authorStages).default('unknown'),

  genre: optionalText(80, 'Please keep the genre short.'),

  // Coerced from the string an input gives us, with commas and spaces stripped
  // so "50,000" is accepted. Capped at two million so a stuck key cannot
  // poison the table.
  wordCount: z.preprocess(
    (value) => {
      const cleaned = blankToUndefined(value)
      if (cleaned === undefined || cleaned === null) return undefined
      if (typeof cleaned === 'number') return Math.round(cleaned)
      if (typeof cleaned !== 'string') return cleaned
      const parsed = Number(cleaned.replace(/[,\s]/g, ''))
      // A value we cannot read is passed straight through, so the schema
      // reports it rather than silently dropping what the visitor typed.
      return Number.isFinite(parsed) ? Math.round(parsed) : cleaned
    },
    z
      .number({ invalid_type_error: 'Please give the word count as a number.' })
      .int('Please give the word count as a whole number.')
      .nonnegative('A word count cannot be a negative number.')
      .max(2_000_000, 'That word count is higher than any book we can publish.')
      .optional(),
  ),

  budget: optionalText(80, 'Please keep the budget answer short.'),

  message: optionalText(
    4000,
    'Please keep this under four thousand characters. The rest can wait for the call.',
  ),

  source: z.enum(leadSources),

  path: optionalText(500, 'Path too long.'),
  referrer: optionalText(500, 'Referrer too long.'),

  /**
   * Honeypot. It is hidden from people and from screen readers, so a real
   * visitor never sees it and never fills it in. A bot that does fill it gets
   * a 200 and { ok: true } from the route and NOTHING is written, so it
   * believes it succeeded and does not come back to try a different shape.
   */
  company: z.string().max(200).optional(),
})

export type LeadInput = z.input<typeof leadSchema>
export type LeadPayload = z.output<typeof leadSchema>

/** True when the honeypot was filled. See the note on `company` above. */
export function isHoneypotFilled(payload: LeadPayload): boolean {
  return Boolean(payload.company && payload.company.trim().length > 0)
}

/** Captured from the request rather than from the visitor. */
export type LeadRequestMeta = {
  path?: string
  referrer?: string
  userAgent?: string
}

/**
 * The parsed payload as a Prisma `Lead` row.
 *
 * `stage` and `source` are already the exact member names of the `AuthorStage`
 * and `LeadSource` enums, so this maps them across unchanged. The types stay
 * as our own string unions on purpose: importing the generated Prisma enums
 * here would stop this module compiling in a checkout where `prisma generate`
 * has not been run, and the site has to run with no database at all.
 */
export function toLeadRecord(payload: LeadPayload, meta: LeadRequestMeta) {
  return {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    stage: payload.stage,
    genre: payload.genre,
    wordCount: payload.wordCount,
    budget: payload.budget,
    message: payload.message,
    source: payload.source,
    path: payload.path ?? meta.path,
    referrer: payload.referrer ?? meta.referrer,
    userAgent: meta.userAgent,
  }
}

export type LeadRecord = ReturnType<typeof toLeadRecord>

/** Flattened field errors, in the shape the route promises the forms. */
export function leadFieldErrors(error: z.ZodError): Record<string, string[]> {
  const flattened = error.flatten()
  const errors: Record<string, string[]> = {}
  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (messages && messages.length > 0) errors[field] = messages
  }
  // Anything not attached to a field, such as a body that is not an object.
  if (flattened.formErrors.length > 0) errors._form = flattened.formErrors
  return errors
}
