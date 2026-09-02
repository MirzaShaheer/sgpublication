/**
 * Questions and answers.
 *
 * The uncomfortable questions are answered first and answered straight. In a
 * market where every competitor promises a bestseller, saying plainly that we
 * cannot guarantee one is a conversion asset, not a liability.
 *
 * Anything marked `home: true` appears in the accordion on the home page.
 * Five do, not the eight that used to: the home page already runs long, and
 * the five kept are the ones every visitor has (what it costs, who keeps the
 * royalties, how long it takes, whether a bestseller can be promised, and how
 * to tell a vanity press). The writing questions were dropped from the home
 * set because they only apply to a ghostwritten book, and they are answered
 * on /faq and on the ghostwriting service page.
 */

export type Faq = {
  id: string
  question: string
  /** Paragraphs. Each string is one <p>. */
  answer: string[]
  home?: boolean
  category: 'Money' | 'Rights' | 'Process' | 'Writing' | 'Results'
}

export const faqs: Faq[] = [
  {
    id: 'cost',
    question: 'What does it actually cost?',
    answer: [
      'Between $199 and $999 at the moment, because all three packages are running at half price. The full prices are $399, $1,199 and $1,999. A finished draft that needs editing, design and publishing is the low end. A book written, published and marketed from nothing is the high end.',
      'The price is fixed when you sign and split into milestones, so you are never asked for the whole sum up front. Anything outside the package is priced before the work starts. No surprise invoices.',
    ],
    home: true,
    category: 'Money',
  },
  {
    id: 'royalties',
    question: 'Do I keep my royalties?',
    answer: [
      'All of them. We take no percentage of your sales, ever.',
      'Every retail account, Amazon KDP, IngramSpark, Audible and the rest, is registered in your name with your bank details and your tax information. The money goes from the retailer to you and never passes through us. You can revoke our access to those accounts at any time and the book keeps selling.',
      'Worth checking with anyone you talk to. Some companies register the accounts in their own name, which means they hold your money, your listing and your ability to change the price.',
    ],
    home: true,
    category: 'Rights',
  },
  {
    id: 'ghostwriting-legitimate',
    question: 'Is ghostwriting legitimate, or is it cheating?',
    answer: [
      'It is legitimate and it is ordinary. A large share of business books, memoirs and celebrity books you have read were written with a ghostwriter, including many that never say so.',
      'The ideas, the experience and the stories are yours. The writer turns hours of your talking into chapters that hold together. Your name is on the cover, you own the copyright, and the writer signs away any claim to it.',
      'If you would rather be credited jointly, we do that too, and it costs nothing extra.',
    ],
    category: 'Writing',
  },
  {
    id: 'dislike-draft',
    question: 'What if I do not like the draft?',
    answer: [
      'You will see it long before it is a finished draft, which is the point. Chapters are delivered in batches of two or three, so the first time you read our writing is week four, not month five.',
      'Two full revision rounds are included. If the voice is wrong we change the writer at no cost, and the new one starts from your interviews. That has happened, and the second pairing has always worked.',
      'If you decide after the first batch that it is not going to work, you pay for what is done and keep all of it, outline and transcripts included.',
    ],
    category: 'Writing',
  },
  {
    id: 'how-long',
    question: 'How long does it take?',
    answer: [
      'If your manuscript is finished, roughly 8 to 10 weeks to a book on sale. If we are writing it from scratch, roughly 5 to 7 months, and 7 to 10 months for a longer book with an audiobook and a managed campaign.',
      'The single thing that changes the schedule is how quickly you review what we send. Authors who read a batch of chapters within a week finish months earlier than authors who let three batches pile up.',
    ],
    home: true,
    category: 'Process',
  },
  {
    id: 'bestseller-guarantee',
    question: 'Do you guarantee bestseller status?',
    answer: [
      'No. Anyone who guarantees it is either misleading you or planning to buy the ranking in a category so small that the title is meaningless.',
      'Amazon ranks books inside categories, and some are small enough that thirty or forty sales in a day puts a book at number one for a few hours. That is a real ranking and close to worthless, and a company can produce it on demand.',
      'We aim instead at categories where your book can honestly compete, forecast the first thirty days before launch, and report the real numbers afterwards even when they disappoint. Around a third of our launches reach number one in a category that means something, and we will say on the first call which side of that yours is on.',
    ],
    home: true,
    category: 'Results',
  },
  {
    id: 'know-nothing',
    question: 'I do not know what an ISBN is. Is that a problem?',
    answer: [
      'Not at all, and most people we speak to do not know either. An ISBN is the thirteen digit number that identifies your book to every shop, library and distributor. Each format needs its own, so a paperback, a hardback and an ebook are three numbers.',
      'We register them in your name and include them in every package. Worth checking elsewhere: if the ISBN is registered to a publishing company rather than to you, that company is your publisher for the life of the book.',
    ],
    category: 'Process',
  },
  {
    id: 'scam-check',
    question: 'How do I know you are not another vanity press?',
    answer: [
      'Check four things, with us and with everyone else you are considering.',
      'Will the retail accounts and the ISBN be in my name, in writing? What percentage of royalties do you take, and do you call a cut a partnership? What is the name and background of the editor on my book, not the size of the team? What happens after launch, and does it cost more?',
      'A company that will not answer those four plainly is not the right company, and that includes us if we ever stop.',
    ],
    home: true,
    category: 'Money',
  },
  {
    id: 'own-copyright',
    question: 'Who owns the copyright?',
    answer: [
      'You do, from the first word. Copyright in the finished text is yours, the ghostwriter signs it over in the contract, and we hold no claim on the manuscript, the cover artwork or the audiobook.',
      'You also get the source files: the layout files, the cover artwork at full resolution, and the audio masters. Hand them to another company in year two and they can start immediately.',
    ],
    category: 'Rights',
  },
  {
    id: 'payment-schedule',
    question: 'How does payment work?',
    answer: [
      'The package price is fixed before we start, and you know the full number before you agree to anything.',
      'For larger work quoted separately, such as ghostwriting, payment is split into milestones tied to delivered work. If a project stops halfway, you pay for the milestones reached and you keep the work.',
    ],
    category: 'Money',
  },
  {
    id: 'word-count',
    question: 'How long should my book be?',
    answer: [
      'A business or self help book usually works between 30,000 and 55,000 words, roughly 140 to 220 printed pages. A memoir runs 60,000 to 90,000. A book padded to look substantial reads as padded, and reviews say so.',
      'We will tell you on the outline call what length your book wants to be, even when that is shorter than the package you were considering.',
    ],
    category: 'Writing',
  },
  {
    id: 'marketing-after',
    question: 'What happens after the launch ends?',
    answer: [
      'The Enterprise package includes ongoing author support: account updates, royalty tracking and fixing platform problems. On the other packages it is available monthly and you can start or stop it whenever you like.',
      'Books do not sell in a straight line. A title that sold forty copies in month six can sell four hundred in month fourteen because a category opened up or a podcast picked it up. Somebody has to be watching for that.',
    ],
    category: 'Results',
  },
  {
    id: 'existing-publisher',
    question: 'I already published a book and it is not selling. Can you help?',
    answer: [
      'Often, yes, and the first step is free. Send us the link and we will look at the cover, the listing, the categories, the price and the reviews, and tell you which of those is the problem.',
      'Sometimes the fix is a new cover and better categories, a few hundred dollars of work. Sometimes it needs a real edit and a relaunch. Sometimes the honest answer is that the market is very small and no advertising will change that. We say which before you spend anything.',
    ],
    category: 'Results',
  },
  {
    id: 'international',
    question: 'Do you work with authors outside the United States?',
    answer: [
      'Yes. Roughly a third of our authors are outside the US, mostly in the UK, Canada, Australia, the UAE and India.',
      'The retail accounts still work, though the tax setup differs and we walk you through it. Interviews run in your time zone and proofs ship wherever you are.',
    ],
    category: 'Process',
  },
]

export const homeFaqs = faqs.filter((faq) => faq.home)

export const faqCategories = [
  'Money',
  'Rights',
  'Process',
  'Writing',
  'Results',
] as const
