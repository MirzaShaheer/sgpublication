import type { ServicePage } from './types'

/**
 * Book marketing, the long form page.
 *
 * Search intent: "book marketing services". This is the most mis-sold service
 * in publishing, so the page is written defensively: what can be bought, what
 * cannot, and what a bestseller claim is actually worth.
 *
 * Kept short and plain on purpose.
 */

export const bookMarketing: ServicePage = {
  slug: 'book-marketing',
  h1: 'Book marketing and launch services',
  lede: 'A launch plan with real dates, ads managed against a target you set, and pitches to podcasts your readers already follow. Weekly reporting, including the weeks it did not work.',
  priceFrom: 'Ad and keyword setup is in the $999 package. Campaigns quoted separately.',
  relatedSlugs: ['publishing', 'author-website', 'cover-design'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'You are buying attention: getting your book in front of people who already read books like it. You are not buying sales, and anyone who says otherwise is selling something else.',
        'Marketing makes a good book bigger. It does not rescue a bad one. If the cover signals the wrong genre or the description reads like a summary, ads just spend money faster to reach the same answer.',
        'So we check those things before taking a marketing budget. We have told authors to spend the money on a new cover instead.',
      ],
    },

    {
      kind: 'list',
      heading: 'The words, in plain English',
      intro: 'These appear in every proposal you will be sent.',
      items: [
        {
          term: 'Categories and keywords',
          detail:
            'The shelves your book sits on and the words that surface it. Free to change, and the highest return work in book marketing. Most self published books are on shelves that are far too broad.',
        },
        {
          term: 'ACOS',
          detail:
            'What you spent on ads divided by what those ads earned. 100 percent means you broke even. The right target depends on what you earn per copy, so anyone quoting one without seeing your royalty is guessing.',
        },
        {
          term: 'Launch team',
          detail:
            'The twenty to a hundred people who agreed to read early and say something on launch day. Unglamorous, mostly your own contacts, and it beats most paid tactics.',
        },
        {
          term: 'Earned media',
          detail:
            'Coverage someone chose to give you: a podcast, a column, a newsletter mention. Slower and far more effective than anything paid, because the audience trusts the host.',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'What a bestseller claim is really worth',
      paragraphs: [
        'Nearly every campaign you are offered promises it. Here is how it works: some categories are small enough that thirty sales in an afternoon put a book at number one. A screenshot is taken. The book is a bestseller forever.',
        'It is not fraud, and it is not nothing. The badge helps on a speaker bio. But it does not mean people are buying your book, and a campaign built around that screenshot is aimed at a photo rather than at readers.',
        'We would rather sell you a book still selling in month nine. If you want the badge too, say so and we will build it in honestly and tell you which category it came from.',
      ],
    },

    {
      kind: 'steps',
      heading: 'How a launch runs',
      intro:
        'Twelve weeks: eight before publication, four after. The work before launch is what decides it.',
      steps: [
        {
          name: 'Categories and keywords',
          detail:
            'We map your shelves against real competition data. This also sets your subtitle, which is a marketing asset and often the first thing we change.',
          timeframe: 'Week minus 8',
        },
        {
          name: 'Your listing page',
          detail:
            'The description rewritten to sell, the author profile finished. Free work with a measurable effect, and the most neglected page in publishing.',
          timeframe: 'Week minus 7',
        },
        {
          name: 'Launch team and review copies',
          detail:
            'We help you build a list of people who will actually read it and send advance copies. Twenty five honest reviews change how every later visitor reads the page.',
          timeframe: 'Weeks minus 6 to minus 2',
        },
        {
          name: 'Podcast and media outreach',
          detail:
            'Forty shows your readers already follow, pitched individually with an angle. Expect five to ten yeses for a first time author with a real subject.',
          timeframe: 'Weeks minus 6 to plus 4',
        },
        {
          name: 'Launch week',
          detail:
            'Ads start small, your own list and channels line up on the same days. We watch the listing hourly for two days, because that is when a category can still be fixed.',
          timeframe: 'Week 0',
        },
        {
          name: 'Ninety day review',
          detail:
            'What sold, where from, what the ads returned, and an honest recommendation: keep going, cut back, or stop. We have recommended stopping.',
          timeframe: 'Week 12',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What you have to do',
      paragraphs: [
        'More than for anything else on this site. About four to six hours a week during the launch, and it cannot be handed to us.',
        'You send the emails to your own contacts, because a note from you gets opened and a note from an agency does not. You show up for the podcasts. You read the weekly number.',
        'What we will not do is post as you or run a social account in your name. It is obvious from the outside and it damages the credibility the book is meant to build.',
      ],
    },

    {
      kind: 'list',
      heading: 'Where the money goes',
      intro:
        'Two separate numbers. The management fee is what you pay us. The ad spend is yours, on your own card, in your own account.',
      items: [
        {
          term: 'The ad budget stays yours',
          detail:
            'It sits on your account and you keep control. A sensible start is $10 to $20 a day. Below that there is not enough data to learn from.',
        },
        {
          term: 'Outreach is priced by target count',
          detail:
            'Nobody honest sells guaranteed placements. Anyone who does is either buying advertorial and calling it press, or will blame your subject when it fails.',
        },
        {
          term: 'What we will not sell you',
          detail:
            'Reviews, followers, or guaranteed rankings. Paid reviews get books delisted and accounts closed.',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'Ask any book marketer these',
      intro: 'The first two end most sales conversations quickly. That is the point.',
      items: [
        {
          term: 'What exactly are you guaranteeing?',
          detail:
            'Guaranteed sales, rankings or press are guarantees nobody can keep. We guarantee the work: campaigns built and managed, pitches sent to named outlets, a report every week.',
        },
        {
          term: 'Whose ad account is it, and can I see the dashboard?',
          detail:
            'Yours, with real login access, not a monthly PDF. If they hold the account you cannot check the spend and leaving means starting from zero.',
        },
        {
          term: 'What would make you tell me to stop?',
          detail:
            'Anyone without a stopping rule will bill you forever. Ours: ninety days of correctly run ads with no improving trend.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What goes wrong',
      paragraphs: [
        'The ads never turn a profit. For a cheap ebook this can be impossible: you earn less per copy than a single click costs. We check that first and say so, rather than taking a fee to lose your money neatly.',
        'Nobody books the author. Usually the pitch, not the book. A pitch leading with a book gets ignored. One leading with a story only you can tell gets a reply.',
        'The book sells for three weeks and stops. That is a launch spike with nothing under it. The fix is slow: keep the ads that work running small and stay visible. Most of our authors earn more in year two than at launch. The ones who do not are usually the ones who stopped.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Can you get my book into bookshops?',
      answer: [
        'We can make it orderable by any shop, which is different. A local shop will often stock a few copies for an author who walks in and asks.',
        'Shelf space in a national chain is not something a self published title generally gets. Anyone promising it is not describing how that trade works.',
      ],
    },
    {
      question: 'How many copies will I sell?',
      answer: [
        'We do not forecast, because nobody can. We can show you what comparable books in your category are ranking at, which is checkable.',
        'For a first time author with a modest following, a few hundred copies in the first year is normal and a few thousand is good.',
      ],
    },
    {
      question: 'Do I need to be on social media?',
      answer: [
        'Not all of it. One channel where your readers actually are beats five accounts posting the same thing.',
        'The mailing list is the real asset, because it belongs to you and no algorithm sits in between. That is why every author website we build collects one.',
      ],
    },
    {
      question: 'Can you market a book you did not publish?',
      answer: [
        'Yes, and a lot of our work is exactly that. We start with a free audit: the cover against its category, the listing page, the keywords, the reviews.',
        'Sometimes that audit says marketing is not the problem, and we tell you. We would rather lose the campaign than take a budget for a book that needs a different fix.',
      ],
    },
  ],
}
