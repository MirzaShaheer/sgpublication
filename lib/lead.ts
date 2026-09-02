import { z } from 'zod'

/**
 * The one lead payload, shared by every capture point and by the API route.
 *
 * The stage values are the Prisma `AuthorStage` enum, so nothing is translated
 * between the form and the database. Every optional text field accepts an
 * empty string and is normalised to undefined, because an empty input should
 * store nothing rather than an empty row value.
 */

export const leadStages = [
  'idea',
  'writing',
  'manuscript_finished',
  'published_not_selling',
  'unknown',
] as const

export type LeadStage = (typeof leadStages)[number]

export const leadSources = ['modal', 'exit', 'inline', 'contact'] as const
export type LeadSource = (typeof leadSources)[number]

/**
 * The four options a visitor is actually offered. `unknown` is the stored
 * default for the email only exit form, and is never shown as a choice.
 *
 * These map one to one onto the six rotating words in the hero, so a visitor
 * who arrived reading "years of expertise" finds themselves in the first
 * option rather than hunting for a category that fits.
 *
 * `response` is the line shown above the details step once the visitor has
 * picked. It answers the specific answer they gave, so the second step reads
 * as a reply rather than as a second form appearing. Each one names a real
 * strength in that stage: a concrete practice, a real timeframe, a free first
 * look. Deliberately not "we are the best at this" -- an unsupported boast at
 * the exact moment someone is deciding whether to trust us reads as the thing
 * the rest of the site is written to avoid, and the specifics are what
 * actually reassure.
 */
export const stageOptions: {
  value: LeadStage
  label: string
  hint: string
  response: string
}[] = [
  {
    value: 'idea',
    label: 'I have an idea',
    hint: 'Nothing written yet, or notes and talks you have never pulled together.',
    response:
      'Good, that is the stage we do most of. More than half the books we publish start with nothing written down, drawn out of you by a named ghostwriter over a series of recorded interviews.',
  },
  {
    value: 'writing',
    label: 'I am partway through writing',
    hint: 'A draft exists. It may be a third of a book or nine tenths of one.',
    response:
      'A part finished draft is the most common thing we are handed. It starts with a structural read: one editor tells you what stays, what moves and what is still missing, before anyone touches a sentence.',
  },
  {
    value: 'manuscript_finished',
    label: 'My manuscript is finished',
    hint: 'It needs editing, a cover, and to be put on sale properly.',
    response:
      'Then you are on our fastest path. A finished manuscript reaches a book on sale in roughly 8 to 10 weeks, fully edited, designed, and listed on every major store in your name.',
  },
  {
    value: 'published_not_selling',
    label: 'It is published and not selling',
    hint: 'The book is out there. Almost nobody is buying it.',
    response:
      'We take on a lot of these, and the first look costs nothing. Send us the link and we will tell you whether it is the cover, the categories, the price or the book itself.',
  },
]

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined))

export const leadSchema = z.object({
  name: optionalText(120),
  email: z.string().trim().toLowerCase().email().max(200),
  phone: optionalText(40),
  country: optionalText(80),
  stage: z.enum(leadStages).default('unknown'),
  genre: optionalText(80),
  wordCount: z
    .union([z.number(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === '') return undefined
      const parsed = typeof value === 'number' ? value : Number(value)
      return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : undefined
    }),
  budget: optionalText(80),
  message: optionalText(4000),
  source: z.enum(leadSources),
  path: optionalText(500),
  referrer: optionalText(500),
  /**
   * Honeypot. A real visitor never sees this field and never fills it. A bot
   * that does gets `{ ok: true }` and nothing is written.
   */
  company: z.string().max(200).optional(),
})

export type LeadInput = z.input<typeof leadSchema>
export type LeadPayload = z.output<typeof leadSchema>
