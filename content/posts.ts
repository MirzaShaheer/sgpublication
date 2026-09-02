/**
 * The three blog posts.
 *
 * Each one answers a question a first time author types into a search box
 * before they know that companies like ours exist, and answers it well enough
 * that the reader does not need to open another tab. That is the whole
 * strategy: the posts carry real search intent and give away the answer.
 *
 * THE SLUGS BELOW ARE ADVERTISED IN app/sitemap.ts. Change one here and change
 * it there in the same edit, or the sitemap points a crawler at a 404.
 *
 * Body blocks are a tiny typed subset rather than markdown: no parser ships to
 * the client, and the renderer in app/blog/[slug] can style each kind properly.
 */

export type PostBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'note'; text: string }

export type Post = {
  slug: string
  title: string
  /** Search intent led, used for <title> and the card. */
  metaTitle: string
  metaDescription: string
  /** One sentence, shown on the index under the title. */
  standfirst: string
  /** Fixed, not computed, so the build output is deterministic. */
  date: string
  readingMinutes: number
  body: PostBlock[]
}

export const posts: Post[] = [
  {
    slug: 'how-much-does-it-cost-to-publish-a-book',
    title: 'What it actually costs to publish a book',
    metaTitle: 'How much does it cost to publish a book?',
    metaDescription:
      'A line by line breakdown of what publishing a book costs: editing, cover design, layout, ISBNs, printing and marketing, with real ranges for each and the costs that are commonly hidden.',
    standfirst:
      'Every line item, with a real range next to it, and the three costs that usually turn up after you have signed.',
    date: '12 March 2026',
    readingMinutes: 9,
    body: [
      {
        kind: 'p',
        text: 'The honest answer is between nothing and about twenty thousand dollars, which is useless, so here is the breakdown instead. These are the market rates we see quoted across the industry, not our prices. Ours are on the packages page.',
      },
      { kind: 'h2', text: 'Editing' },
      {
        kind: 'p',
        text: 'Editing is three different jobs that are often sold as one word, which is where a lot of confusion about price comes from. A developmental edit looks at structure and argument and asks whether the book works at all. A line edit works on sentences. A proofread catches errors. A quote for "editing" that does not say which of the three you are buying is not a quote.',
      },
      {
        kind: 'list',
        items: [
          'Developmental edit: $1,200 to $4,000 for a typical non fiction book',
          'Line edit: $0.02 to $0.05 a word, so $1,000 to $2,500 on a 50,000 word book',
          'Proofread: $500 to $1,200',
        ],
      },
      {
        kind: 'p',
        text: 'A finished draft that has never been read by an editor usually needs all three. A book that has been through a good developmental edit sometimes needs only the last two.',
      },
      { kind: 'h2', text: 'Cover design' },
      {
        kind: 'p',
        text: 'Between $300 and $2,500. The gap is mostly about whether you are getting a template with your title typed into it or a designer who reads the book. The thing worth paying for is a cover that works as a thumbnail on a phone, because that is the size at which almost every buying decision is made.',
      },
      { kind: 'h2', text: 'Interior layout' },
      {
        kind: 'p',
        text: '$300 to $1,200 for a text only book. More if you have photographs, tables or a fold out map. You need it set twice, once for print at a fixed page size and once reflowed for ebook, and a quote should say whether both are included.',
      },
      { kind: 'h2', text: 'ISBNs' },
      {
        kind: 'p',
        text: 'In the United States, $125 for one from Bowker or $295 for ten, which is why nobody sensible buys one. Each format needs its own, so a paperback, a hardback and an ebook are three numbers. In the UK, Canada and several other countries they are free or cheap from the national agency.',
      },
      {
        kind: 'note',
        text: 'Amazon will give you a free ISBN. Take it and Amazon is listed as your publisher and the number is not portable to another printer. Buy your own.',
      },
      { kind: 'h2', text: 'Printing' },
      {
        kind: 'p',
        text: 'Print on demand costs you nothing up front. The printer takes its cost out of each sale, usually $3 to $6 for a paperback, and you keep the rest after the retailer’s share. Ordering author copies costs roughly the same per book plus shipping.',
      },
      { kind: 'h2', text: 'Marketing' },
      {
        kind: 'p',
        text: 'This is the line most first time authors leave out entirely, and it is the reason for most of the books that sell nine copies. A launch that reaches strangers needs somewhere between $500 and $5,000 of advertising spend plus somebody to run it. A book with no reviews, no email list and no chosen categories will not be shown to anyone by Amazon, because Amazon shows a book to strangers only once it is already selling.',
      },
      { kind: 'h2', text: 'Ghostwriting, if you are not writing it' },
      {
        kind: 'p',
        text: '$15,000 to $60,000 at agency rates for a full length book, less through a publishing house that bundles it. This is the single biggest variable and the reason quotes range so widely: a company quoting $2,500 is not writing your book, and a company quoting $18,000 probably is.',
      },
      { kind: 'h2', text: 'The three that arrive late' },
      {
        kind: 'list',
        items: [
          'Revisions beyond the included rounds, often billed hourly and rarely mentioned up front. Ask how many are included and what the rate is after that.',
          'Distribution setup fees, charged by some companies for uploading your files to accounts you could open yourself for nothing.',
          'Ongoing management. Ask what happens after launch and whether it costs more. For a lot of companies the answer is silence, and for others it is a monthly retainer nobody mentioned.',
        ],
      },
      {
        kind: 'p',
        text: 'Add the middle of every range above and a self published non fiction book done properly lands somewhere around $6,000 to $9,000 without ghostwriting, and $20,000 to $30,000 with it, bought piece by piece. Packages exist because those combinations repeat and buying them together is cheaper than buying them one at a time.',
      },
    ],
  },
  {
    slug: 'what-is-an-isbn',
    title: 'What an ISBN is, and why whose name it is in matters',
    metaTitle: 'What is an ISBN and do I need one?',
    metaDescription:
      'What an ISBN is, how many you need, what they cost, where to get one, and why registering it in your own name rather than your publisher’s is one of the most consequential decisions you will make.',
    standfirst:
      'A thirteen digit number that decides who is listed as your publisher for the life of the book.',
    date: '4 February 2026',
    readingMinutes: 6,
    body: [
      {
        kind: 'p',
        text: 'An ISBN is the thirteen digit number that identifies your book to every shop, library and distributor in the world. It is what a bookseller types in to order a copy. Most people we speak to have never heard of it, which is fine, and a few have been quietly signed up to an arrangement they would not have agreed to if anyone had explained it.',
      },
      { kind: 'h2', text: 'How many you need' },
      {
        kind: 'p',
        text: 'One per format. A paperback, a hardback and an ebook are three separate numbers, and an audiobook is a fourth. A second edition with substantially changed content needs a new one; a reprint with a typo fixed does not.',
      },
      { kind: 'h2', text: 'What they cost' },
      {
        kind: 'list',
        items: [
          'United States: Bowker, $125 for one, $295 for ten, $575 for a hundred',
          'United Kingdom: Nielsen, sold in blocks, roughly £91 for ten',
          'Canada, Australia and several others: free from the national agency',
        ],
      },
      {
        kind: 'p',
        text: 'Buying singles in the US is close to a trap. Ten costs barely twice what one does, and you will need at least three for a single book in three formats.',
      },
      { kind: 'h2', text: 'The part that matters' },
      {
        kind: 'p',
        text: 'The ISBN is registered to an entity, and that entity is listed as the publisher of your book everywhere the number appears. If a publishing services company registers it to themselves, they are your publisher of record for the life of that edition.',
      },
      {
        kind: 'p',
        text: 'In practice that means a second edition through a different company needs a new ISBN and loses the reviews and sales history attached to the old one. It means the company controls the metadata: the categories, the description, sometimes the price. And it means that if you fall out with them, the listing does not simply come with you.',
      },
      {
        kind: 'note',
        text: 'Ask any company you are considering, in writing: will the ISBN be registered in my name or in yours? A straight answer takes one sentence.',
      },
      { kind: 'h2', text: 'The free Amazon one' },
      {
        kind: 'p',
        text: 'Amazon KDP offers a free ISBN. It costs nothing and it is not portable: Amazon is listed as the publisher, and you cannot use that number with IngramSpark or any other printer, which shuts you out of bookshops and libraries. If you only ever intend to sell ebooks on Amazon, it is defensible. Otherwise buy your own.',
      },
      { kind: 'h2', text: 'What to do' },
      {
        kind: 'list',
        items: [
          'Buy a block of ten in your own name, or your own company’s name, from your national agency.',
          'Register the title record yourself so the publisher of record is you.',
          'Assign one per format, and keep the list somewhere you will find it in three years.',
        ],
      },
      {
        kind: 'p',
        text: 'We include registration in your name in every package, and we say so here rather than only in the contract, because it is the single easiest thing to check about anyone you are considering.',
      },
    ],
  },
  {
    slug: 'self-publishing-versus-traditional-publishing',
    title: 'Self publishing or traditional: which one is actually for you',
    metaTitle: 'Self publishing vs traditional publishing',
    metaDescription:
      'An honest comparison of self publishing and traditional publishing: advances, royalty rates, timelines, rights, control and what each route actually requires of the author.',
    standfirst:
      'Not which is better. Which is better for the specific book you are holding.',
    date: '18 December 2025',
    readingMinutes: 8,
    body: [
      {
        kind: 'p',
        text: 'Most articles on this answer the question they prefer. Here is the genuinely useful version, which is that the two routes suit different books and the deciding factors are boring and practical.',
      },
      { kind: 'h2', text: 'What traditional publishing gives you' },
      {
        kind: 'list',
        items: [
          'An advance, paid against future royalties. For a debut non fiction author with no platform, typically $5,000 to $15,000, and often less.',
          'Editing, design, production and distribution paid for by the publisher.',
          'Physical bookshop distribution, which self publishing reaches but rarely at scale.',
          'The credibility of an imprint, which matters in some fields and not at all in others.',
        ],
      },
      { kind: 'h2', text: 'What it costs you' },
      {
        kind: 'list',
        items: [
          'Royalties of roughly 7 to 12 percent of the cover price on print, 25 percent of net on ebooks, and you earn nothing until the advance is earned out.',
          'Eighteen months to two years from signed contract to a book on a shelf.',
          'The rights, for the term of the contract, which is often the life of copyright unless it reverts.',
          'Control over the title, the cover and often the subtitle.',
          'An agent first, which is its own submission process and its own year.',
        ],
      },
      { kind: 'h2', text: 'What self publishing gives you' },
      {
        kind: 'list',
        items: [
          'Roughly 60 to 70 percent of the cover price on a paperback after print and retail costs, and 70 percent on ebooks priced between $2.99 and $9.99.',
          'Three to ten months, start to finish.',
          'Every right, kept.',
          'Complete control of the cover, the title, the price and the categories, and the ability to change any of them on a Tuesday afternoon.',
        ],
      },
      { kind: 'h2', text: 'What it costs you' },
      {
        kind: 'p',
        text: 'The money up front, and the responsibility for the parts a publisher would have handled. A self published book with no editor, a template cover and no launch is indistinguishable from the thousands of others in that condition, and it sells like them.',
      },
      { kind: 'h2', text: 'The practical test' },
      {
        kind: 'p',
        text: 'Ask what the book is for. If the book is the product, and you want it in airport bookshops and reviewed in newspapers, and you can wait two years, traditional publishing is the better route and you should be querying agents rather than reading this.',
      },
      {
        kind: 'p',
        text: 'If the book exists to do a job for something else, to bring in clients, to establish authority in a field, to be handed to a prospect or sold at the back of a room, then self publishing wins on nearly every axis that matters. You keep the money, you keep the rights, it is out this year, and you can put your own phone number in the back.',
      },
      {
        kind: 'note',
        text: 'A memoir written for a family, a business book written to win consulting work, and a niche technical book with two thousand possible readers are all firmly in the second category, whatever a publisher’s rejection letter implied.',
      },
      { kind: 'h2', text: 'The third option nobody names' },
      {
        kind: 'p',
        text: 'Hybrid or assisted publishing, which is what we do, is self publishing with the production work bought in. The important distinction is not the label but the terms: who keeps the royalties, whose name the accounts and the ISBN are in, and whether you are paying once for work or handing over a share of sales forever. A company that calls itself a hybrid publisher and takes 30 percent of your royalties is a traditional publisher that also charged you.',
      },
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug)
}
