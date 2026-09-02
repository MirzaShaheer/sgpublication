/**
 * PLACEHOLDER PORTFOLIO
 * ----------------------------------------------------------------------------
 * All twelve titles, authors and results below are invented. Covers are drawn
 * from the brand palette by <GeneratedCover>, not sourced from anywhere.
 * Replace this entire file with real published work before launch, and make
 * sure you have each author's written permission to show their book.
 */

export type Book = {
  slug: string
  title: string
  author: string
  genre: Genre
  year: number
  /** One line about the book, shown on the portfolio page. */
  note: string
  /** Which SG package produced it. */
  package: string
  /** Force a specific cover archetype where the default pairing repeats. */
  archetype?:
    | 'frame'
    | 'band'
    | 'initial'
    | 'stack'
    | 'arc'
    | 'ruled'
  palette?: number
}

export const genres = [
  'Business',
  'Memoir',
  'Health',
  'Self help',
  'Faith',
  'History',
] as const

export type Genre = (typeof genres)[number]

export const books: Book[] = [
  {
    slug: 'the-quiet-hours',
    title: 'The Quiet Hours',
    author: 'Dr Marisol Vance',
    genre: 'Health',
    year: 2024,
    note: 'Eleven years of clinical notes turned into a parenting book that hospitals now hand out.',
    package: 'Enterprise Global and Author Brand',
    archetype: 'arc',
    palette: 2,
  },
  {
    slug: 'ship-it-twice',
    title: 'Ship It Twice',
    author: 'Ade Okonkwo',
    genre: 'Business',
    year: 2024,
    note: 'A founder memoir about the second attempt, written from a finished but unstructured draft.',
    package: 'Self-Publishing and Management',
    archetype: 'band',
    palette: 0,
  },
  {
    slug: 'a-village-of-small-wars',
    title: 'A Village of Small Wars',
    author: 'Helen Brightwater',
    genre: 'Memoir',
    year: 2023,
    note: 'Forty years of teaching in one Norfolk village, drawn out over sixteen recorded interviews.',
    package: 'Multi-Platform and Author Growth',
    archetype: 'frame',
    palette: 1,
  },
  {
    slug: 'the-lease-you-can-do',
    title: 'The Lease You Can Do',
    author: 'Ravi Patel',
    genre: 'Business',
    year: 2023,
    note: 'A failed self published title, rebuilt and relaunched with a new cover and a real edit.',
    package: 'Self-Publishing and Management',
    archetype: 'stack',
    palette: 3,
  },
  {
    slug: 'ordinary-mercy',
    title: 'Ordinary Mercy',
    author: 'Pastor Ellis Kade',
    genre: 'Faith',
    year: 2024,
    note: 'Thirty years of sermons shaped into twelve chapters with a study guide at the back.',
    package: 'Multi-Platform and Author Growth',
    archetype: 'ruled',
    palette: 4,
  },
  {
    slug: 'the-second-shift',
    title: 'The Second Shift',
    author: 'Nadia Oyelaran',
    genre: 'Self help',
    year: 2025,
    note: 'Written for nurses returning to work after burnout, with an audiobook narrated by the author.',
    package: 'Enterprise Global and Author Brand',
    archetype: 'initial',
    palette: 5,
  },
  {
    slug: 'salt-and-iron',
    title: 'Salt and Iron',
    author: 'Thomas Bell',
    genre: 'History',
    year: 2023,
    note: 'A local history of three shipyards, set with forty archival plates and a fold out map.',
    package: 'Multi-Platform and Author Growth',
    archetype: 'band',
    palette: 4,
  },
  {
    slug: 'what-my-father-carried',
    title: 'What My Father Carried',
    author: 'Yusra Almasi',
    genre: 'Memoir',
    year: 2025,
    note: 'A family memoir across two countries, written in English from interviews conducted in Arabic.',
    package: 'Enterprise Global and Author Brand',
    archetype: 'stack',
    palette: 0,
  },
  {
    slug: 'the-founders-checkup',
    title: 'The Founder Checkup',
    author: 'Dr Ian Reeve',
    genre: 'Health',
    year: 2024,
    note: 'A physician writing for executives, published simultaneously in print, ebook and audio.',
    package: 'Enterprise Global and Author Brand',
    archetype: 'frame',
    palette: 5,
  },
  {
    slug: 'ninety-days-of-nothing',
    title: 'Ninety Days of Nothing',
    author: 'Coral Mendes',
    genre: 'Self help',
    year: 2022,
    note: 'A quiet book about doing less, which found its readers slowly and then quickly.',
    package: 'Self-Publishing and Management',
    archetype: 'arc',
    palette: 1,
  },
  {
    slug: 'the-back-office-empire',
    title: 'The Back Office Empire',
    author: 'Grant Whitfield',
    genre: 'Business',
    year: 2025,
    note: 'Written in eleven weeks around a full schedule, using two interviews a week.',
    package: 'Multi-Platform and Author Growth',
    archetype: 'ruled',
    palette: 2,
  },
  {
    slug: 'keeping-the-lamps-lit',
    title: 'Keeping the Lamps Lit',
    author: 'Rev Iris Nakamura',
    genre: 'Faith',
    year: 2022,
    note: 'A chaplain writing about night shifts in hospital, now used in two training programmes.',
    package: 'Multi-Platform and Author Growth',
    archetype: 'initial',
    palette: 3,
  },
]

export const publishedCopy = {
  heading: 'Books we have published',
  lede: 'Twelve of the four hundred and some titles we have taken from a first call to a book on sale.',
  placeholderNote:
    'Sample portfolio. Titles and covers shown here are illustrative.',
} as const
