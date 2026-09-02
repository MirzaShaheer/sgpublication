/**
 * The six words that cycle in the hero headline.
 *
 * These are not decorative. Each one is an entry point a first time author
 * actually arrives from, and each maps to one of the four stage options in the
 * popup form, so a visitor sees themselves named within the first few seconds.
 *
 *   idea, notes                 -> "I have an idea"
 *   rough draft, life story     -> "I am partway through writing"
 *   finished manuscript         -> "My manuscript is finished"
 *   years of expertise          -> "I have an idea" (the expert who has not started)
 *
 * Order matters: the list starts at the earliest entry point so the first
 * server rendered word is the one the largest share of visitors identify with.
 */
export const heroWords = [
  'idea',
  'notes',
  'rough draft',
  'life story',
  'finished manuscript',
  'years of expertise',
] as const

export type HeroWord = (typeof heroWords)[number]

export const heroCopy = {
  lineOne: 'We turn your',
  lineThree: 'into a book people buy.',
  body: 'We handle all six stages of making a book: the idea, the writing, the editing and design, publishing to every major store, the launch, and sales after that. You keep the rights and every royalty.',
  primaryCta: { label: 'Book a free call', href: '/contact' },
  secondaryCta: { label: 'See how it works', href: '/how-it-works' },
  trustLine:
    'More than four hundred authors published since 2016. The first call is free, and nothing is charged until the plan is in writing.',
  annotations: [
    { target: 'cover', label: 'We design the cover' },
    { target: 'spine', label: 'We set the interior and the spine' },
    { target: 'edge', label: 'We prepare, publish and market it' },
  ],
} as const
