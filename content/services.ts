/**
 * The service index. Long form copy for each service page lives in
 * /content/service-pages/<slug>.ts so this file stays readable.
 */

export type ServiceIconKey =
  | 'quill'
  | 'proof'
  | 'cover'
  | 'press'
  | 'audio'
  | 'megaphone'
  | 'window'

export type Service = {
  slug: string
  /** Name as shown in navigation and on the card. */
  name: string
  /** Longer, search intent led title for the service page h1. */
  pageTitle: string
  /** One plain sentence, used on the home page list. */
  oneLiner: string
  /**
   * What is actually in the box, as five or six short noun phrases. This is
   * the answer to "read what each service includes", so it is deliverables
   * only: things that arrive, not qualities we claim. The long form reasoning
   * lives in content/service-pages/<slug>.ts.
   */
  includes: string[]
  /** Realistic elapsed time for this service alone, not for a whole book. */
  timeframe: string
  icon: ServiceIconKey
  /** Which of the six stages this service belongs to. */
  stage: 'Idea' | 'Manuscript' | 'Production' | 'Publishing' | 'Launch' | 'Ongoing'
  /** Meta description for the service page. */
  metaDescription: string
  /** The search intent this page is built around. */
  intent: string
}

export const services: Service[] = [
  {
    slug: 'ghostwriting',
    name: 'Ghostwriting',
    pageTitle: 'Book ghostwriting services',
    oneLiner:
      'A named writer interviews you every week and writes the book in your voice, with you approving every chapter.',
    includes: [
      'A named writer you meet before you sign',
      'Ten to sixteen recorded interviews, transcripts yours to keep',
      'A chapter by chapter outline you approve before writing starts',
      'Chapters delivered in batches from week six, not held to the end',
      'Two full revision rounds on the finished draft',
      'Copyright assigned to you at each milestone, and a signed confidentiality agreement',
    ],
    timeframe: '4 to 7 months',
    icon: 'quill',
    stage: 'Manuscript',
    metaDescription:
      'Book ghostwriting services for first time authors. A named writer, weekly recorded interviews, chapters delivered in batches, two revision rounds, and full authorship and copyright kept by you.',
    intent: 'book ghostwriting services',
  },
  {
    slug: 'editing',
    name: 'Editing and proofreading',
    pageTitle: 'Book editing and proofreading services',
    oneLiner:
      'Three separate passes, structure first, then sentences, then errors, each by a different named editor.',
    includes: [
      'A free sample edit of 1,500 words of your own book, before you commit',
      'A manuscript assessment saying which passes your book actually needs',
      'Developmental edit: an editorial letter of eight to fifteen pages, and a call',
      'Line edit and copy edit in tracked changes, by two different editors',
      'A style sheet recording every consistency decision made',
      'Proofreading done on the typeset pages, not on the Word file',
    ],
    timeframe: '8 to 12 weeks',
    icon: 'proof',
    stage: 'Production',
    metaDescription:
      'Developmental editing, line editing and proofreading for books. Three separate passes by named editors, with a sample edit before you commit and a clear explanation of what each pass changes.',
    intent: 'book editing services',
  },
  {
    slug: 'cover-design',
    name: 'Cover design',
    pageTitle: 'Book cover design services',
    oneLiner:
      'Two concepts and three revisions, designed to work as a thumbnail on a phone as well as in print.',
    includes: [
      'Category research against the top forty titles on your shelf',
      'Two genuinely different concepts, shown at thumbnail size and on a mockup',
      'Three revision rounds on the direction you choose',
      'Back cover copy, spine, and a wrap built to your final page count',
      'Print ready files, ebook cover, and the layered source artwork',
      'A physical proof checked before the book goes on sale',
    ],
    timeframe: '3 to 4 weeks',
    icon: 'cover',
    stage: 'Production',
    metaDescription:
      'Book cover design services for print and ebook. Two concepts, three revision rounds, genre research, thumbnail testing, and print ready files with the spine width calculated for your page count.',
    intent: 'book cover design services',
  },
  {
    slug: 'publishing',
    name: 'Publishing and distribution',
    pageTitle: 'Self publishing packages and distribution',
    oneLiner:
      'Accounts in your name on every major store, files uploaded and proofed, and a physical copy checked before launch.',
    includes: [
      'KDP and IngramSpark accounts opened in your name, on a call with us',
      'An ISBN for each format, registered to you as publisher of record',
      'Interior layout for print, plus an ebook file that reflows on a phone',
      'Description, categories and up to seven keyword phrases written for you',
      'A printed proof posted to you and read on paper before launch',
      'Listings on Amazon, Barnes and Noble, Apple Books, Kobo and Google Play',
    ],
    timeframe: '6 to 7 weeks',
    icon: 'press',
    stage: 'Publishing',
    metaDescription:
      'Self publishing packages that put your book on Amazon, Barnes and Noble, Apple Books, Kobo and Google Play. Accounts registered in your name, ISBN included, and 100 percent of royalties kept by you.',
    intent: 'self publishing packages',
  },
  {
    slug: 'audiobook',
    name: 'Audiobook production',
    pageTitle: 'Audiobook production services',
    oneLiner:
      'A professional narrator, a studio recording, and distribution to Audible, Spotify and Apple.',
    includes: [
      'Three to five narrators auditioning on two pages of your own book',
      'A full sample chapter you sign off before the book is booked',
      'Studio recording, and a pronunciation list recorded by you',
      'Line by line proofing against the manuscript, by someone other than the narrator',
      'Mastering to the retail specification, and the master files handed to you',
      'Distribution to Audible, Spotify, Apple Books and the library platforms',
    ],
    timeframe: '8 to 12 weeks',
    icon: 'audio',
    stage: 'Publishing',
    metaDescription:
      'Audiobook production services including narrator auditions, studio recording, proofing against the manuscript, mastering to retail standard, and distribution to Audible, Spotify and Apple Books.',
    intent: 'audiobook production services',
  },
  {
    slug: 'book-marketing',
    name: 'Book marketing',
    pageTitle: 'Book marketing and launch services',
    oneLiner:
      'A launch plan with real dates, Amazon ads managed for you, and outreach to media your readers already follow.',
    includes: [
      'Category and keyword strategy built on real competition data',
      'Your listing page rewritten as sales copy, not as a summary',
      'A launch team built and advance review copies sent',
      'Individual pitches to forty podcasts and outlets your readers follow',
      'Amazon advertising managed on your own account, which you keep',
      'A weekly report of spend and return, including the weeks it did not work',
    ],
    timeframe: '12 weeks, 8 of them before publication',
    icon: 'megaphone',
    stage: 'Launch',
    metaDescription:
      'Book marketing and launch services: category strategy, managed Amazon advertising, press release distribution, podcast and media outreach, and weekly reporting on spend and return.',
    intent: 'book marketing services',
  },
  {
    slug: 'author-website',
    name: 'Author website',
    pageTitle: 'Author website design',
    oneLiner:
      'A fast, simple site that sells the book and collects reader emails you own.',
    includes: [
      'Domain, hosting and mailing list registered in your name on day one',
      'Copy written with you: home, about, book pages and press kit',
      'Buy links for every format on every store you are listed with',
      'Email capture with a real incentive, tested end to end on a phone',
      'A press kit a producer can use without emailing you first',
      'A recorded walkthrough so you can edit the site yourself afterwards',
    ],
    timeframe: '2 to 4 weeks',
    icon: 'window',
    stage: 'Launch',
    metaDescription:
      'Author website design for published authors. A fast one page or full site build with buy links to every store, an email list you own, press kit, and speaking enquiry form.',
    intent: 'author website design',
  },
]

export function getService(slug: string) {
  return services.find((service) => service.slug === slug)
}

export const servicesCopy = {
  heading: 'What we actually do',
  lede: 'Six stages, seven services. You can take all of it or the one piece you are missing.',
} as const
