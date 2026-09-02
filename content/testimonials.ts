/**
 * PLACEHOLDER: these authors, books and results are invented sample content
 * written to the right length and shape. Replace with real, permissioned
 * testimonials before launch, and keep the structure: one specific fear named,
 * one specific thing that resolved it, one concrete result.
 */

export type Testimonial = {
  id: string
  /** Four sentences. Names a fear, not a feeling. */
  quote: string[]
  name: string
  /** What they do, so a reader can see themselves in it. */
  role: string
  bookTitle: string
  bookGenre: string
  /** The result, stated plainly and without a rounded up number. */
  result: string
  /** Initials used in the portrait placeholder. */
  initials: string
  featured?: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: 'dr-marisol-vance',
    featured: true,
    quote: [
      'I had eleven years of clinical notes and a folder of talks, and three separate companies had quoted me somewhere between nine and twenty two thousand dollars without ever explaining what the difference was.',
      'What made me sign with SG was that they sent me the milestone schedule and the name of my editor before I had paid anything, and the editor emailed me herself.',
      'The part I was most afraid of was that it would come back sounding like a corporate brochure, and it did not, because they sent me two chapters at week four and I could hear my own voice in them.',
      'It has sold just over four thousand copies, and more importantly it is the reason two hospital systems now call me instead of the other way round.',
    ],
    name: 'Dr Marisol Vance',
    role: 'Paediatric sleep specialist, Portland',
    bookTitle: 'The Quiet Hours',
    bookGenre: 'Health and parenting',
    result:
      'Just over 4,000 copies in fourteen months, and a speaking calendar that now books nine months ahead.',
    initials: 'MV',
  },
  {
    id: 'ade-okonkwo',
    quote: [
      'I had forty thousand words and absolutely no idea what the next step was.',
      'They read the whole thing before quoting me, which nobody else did.',
      'The developmental edit cut nine thousand words and the book is far better for it.',
      'It has been in the top three of its category since March.',
    ],
    name: 'Ade Okonkwo',
    role: 'Founder, logistics software',
    bookTitle: 'Ship It Twice',
    bookGenre: 'Business',
    result: 'Top three in its Amazon category for seven consecutive months.',
    initials: 'AO',
  },
  {
    id: 'helen-brightwater',
    quote: [
      'I am seventy one and I did not want to be sold to.',
      'My daughter sat in on the first call and afterwards she said they were the only ones who answered a direct question directly.',
      'The interviews were the best part, because I talked and somebody finally wrote it down properly.',
      'My grandchildren have a copy each and it is in two libraries in the county.',
    ],
    name: 'Helen Brightwater',
    role: 'Retired schoolteacher, Norfolk',
    bookTitle: 'A Village of Small Wars',
    bookGenre: 'Memoir',
    result: 'Stocked by two county library services and three independent shops.',
    initials: 'HB',
  },
  {
    id: 'ravi-patel',
    quote: [
      'My first book was self published badly and sold nine copies, most of them to relatives.',
      'SG relaunched it with a new cover, a real edit and proper categories rather than starting again from nothing.',
      'They told me upfront that the middle third was the problem, which stung and was correct.',
      'The relaunched edition has done just under twelve hundred copies and the ads have been profitable since month two.',
    ],
    name: 'Ravi Patel',
    role: 'Commercial property advisor, Birmingham',
    bookTitle: 'The Lease You Can Do',
    bookGenre: 'Business',
    result:
      'Relaunch reached just under 1,200 copies, with advertising profitable from month two.',
    initials: 'RP',
  },
]

export const featuredTestimonial =
  testimonials.find((testimonial) => testimonial.featured) ?? testimonials[0]

export const otherTestimonials = testimonials.filter(
  (testimonial) => !testimonial.featured,
)
