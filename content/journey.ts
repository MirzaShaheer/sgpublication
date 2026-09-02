/**
 * The six stages of making a book, as SG runs them.
 *
 * Naming what the AUTHOR has to do at each stage is the trust move on this
 * site. Most publishing companies hide it, an author signs, and then discovers
 * in month three that they owe forty hours of interviews. Every stage below
 * states both sides of the work and a realistic timeframe.
 */

export type JourneyStage = {
  id: string
  /** Stage number as shown, 1 through 6. */
  index: number
  name: string
  /** Two sentences of plain explanation. No jargon without a definition. */
  summary: string
  sgDoes: string[]
  authorDoes: string[]
  timeframe: string
  /**
   * The timeframe as a bare duration, for the six across strip where the
   * full line has no room. Stage two carries two durations and stage six is
   * not a duration at all, so this cannot be derived from `timeframe` by
   * cutting it at the first comma.
   */
  shortTimeframe: string
  /** Key for the object state drawn at the centre of the signature section. */
  objectState:
    | 'pages'
    | 'manuscript'
    | 'blank-book'
    | 'jacketed'
    | 'sticker'
    | 'royalties'
  /** One line describing what the centre object looks like at this stage. */
  objectCaption: string
}

export const journey: JourneyStage[] = [
  {
    id: 'idea',
    index: 1,
    name: 'Idea',
    summary:
      'You talk, we take notes. You end up with a written outline, a clear reader in mind, and an honest read on whether the book will sell.',
    sgDoes: [
      'A ninety minute concept call, recorded and transcribed',
      'A market check on the twelve closest competing books',
      'A chapter by chapter outline you can read in ten minutes',
      'A positioning statement: who the book is for',
    ],
    authorDoes: [
      'Turn up to one call and talk about what you know',
      'Read the outline and tell us what is wrong with it',
      'Approve the outline in writing',
    ],
    timeframe: '2 to 3 weeks',
    shortTimeframe: '2 to 3 weeks',
    objectState: 'pages',
    objectCaption: 'A loose stack of typed pages and notes',
  },
  {
    id: 'manuscript',
    index: 2,
    name: 'Manuscript',
    summary:
      'The book gets written. A ghostwriter interviews you, writes in your voice, and you review every chapter as it lands.',
    sgDoes: [
      'Weekly recorded interviews of sixty to ninety minutes',
      'A named writer who stays on the project to the end',
      'Chapters delivered in batches, never a whole book at once',
      'Two full revision rounds included',
    ],
    authorDoes: [
      'One interview a week for twelve to twenty weeks',
      'Read each batch within a week and mark what does not sound like you',
      'Supply the specifics only you have: names, dates, documents, stories',
    ],
    timeframe: '3 to 5 months for a ghostwritten book, 4 to 6 weeks if your draft is already finished',
    shortTimeframe: '3 to 5 months',
    objectState: 'manuscript',
    objectCaption: 'A bound manuscript, squared and clipped',
  },
  {
    id: 'production',
    index: 3,
    name: 'Production',
    summary:
      'The manuscript becomes a book object: editing, proofreading, cover design, and the interior layout that decides how the printed page looks.',
    sgDoes: [
      'Three passes: structure, then sentences, then errors',
      'Two cover concepts and three revision rounds, tested at thumbnail size',
      'Interior layout set for print and reflowed for ebook',
      'ISBN registration in your name, the number every store and library uses',
    ],
    authorDoes: [
      'Approve the edit, cover and interior at three sign off points',
      'Read the proof once, carefully. Last chance to catch a wrong date',
      'Approve the back cover text and the author biography',
    ],
    timeframe: '6 to 9 weeks',
    shortTimeframe: '6 to 9 weeks',
    objectState: 'blank-book',
    objectCaption: 'A bound book, cover still blank',
  },
  {
    id: 'publishing',
    index: 4,
    name: 'Publishing',
    summary:
      'Your book goes on sale. We open the accounts in your name, upload the files, set the price, and check every listing before it goes live.',
    sgDoes: [
      'Amazon KDP and IngramSpark accounts opened in your name',
      'Paperback, hardback and ebook files uploaded, priced and proofed',
      'Distribution to Barnes and Noble, Apple Books, Kobo, Google Play, and the library and bookshop channels',
      'Listing copy, categories and keywords written and tested',
    ],
    authorDoes: [
      'Provide identity and tax details. The accounts and the money are yours',
      'Approve the final price and the listing text',
      'Hold the first printed copy and confirm it is right',
    ],
    timeframe: '3 to 5 weeks',
    shortTimeframe: '3 to 5 weeks',
    objectState: 'jacketed',
    objectCaption: 'A finished jacketed hardback',
  },
  {
    id: 'launch',
    index: 5,
    name: 'Launch',
    summary:
      'A book merely on sale is invisible. Launch is the weeks where we put it in front of readers who already buy books like yours.',
    sgDoes: [
      'A launch plan with dates, categories and a target for the first thirty days',
      'Amazon advertising managed, with spend and return reported weekly',
      'A press release, plus outreach to podcasts your readers already follow',
      'Category strategy aimed at rankings your book can honestly win',
    ],
    authorDoes: [
      'Send one email to your own contacts. This matters more than anything we do',
      'Sit for three to eight podcast interviews we book',
      'Approve the advertising budget and the launch date',
    ],
    timeframe: '4 to 6 weeks of active launch',
    shortTimeframe: '4 to 6 weeks',
    objectState: 'sticker',
    objectCaption: 'The finished book carrying a bestseller sticker',
  },
  {
    id: 'ongoing',
    index: 6,
    name: 'Ongoing',
    summary:
      'Launch ends and the book either keeps selling or it does not. This stage is the difference, and it is the part most companies stop doing.',
    sgDoes: [
      'A monthly royalty and sales report in plain language',
      'Review generation through legitimate reader programmes, never paid reviews',
      'Backlist promotion: price runs, refreshed keywords, new categories',
      'Second edition planning, and whether a follow up is worth writing',
    ],
    authorDoes: [
      'Read one report a month, which takes about five minutes',
      'Tell us when something changes that the book should reflect',
      'Decide, once a year, whether to keep going',
    ],
    timeframe: 'Included on the Enterprise package, available monthly on the others',
    shortTimeframe: 'Ongoing',
    objectState: 'royalties',
    objectCaption: 'The book beside a small royalty chart',
  },
]

export const journeyCopy = {
  heading: 'From a rough idea to a book that keeps selling',
  lede: 'Six stages. Here is what happens in each one, what we do, and what you have to do.',
  cta: { label: 'Start at stage one', href: '/contact' },
} as const
