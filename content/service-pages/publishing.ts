import type { ServicePage } from '@/content/service-pages/types'

/**
 * Publishing and distribution, the long form page.
 *
 * Search intent: "self publishing packages". The one thing this page has to do
 * is teach the difference between a publisher and a vanity press, because that
 * single distinction decides whether an author keeps their own book.
 *
 * Kept short and plain on purpose. Short sentences, every term defined once,
 * nothing said twice.
 */

export const publishingPage: ServicePage = {
  slug: 'publishing',
  h1: 'Self publishing packages and distribution',
  lede: 'Your book on Amazon and every major store, with the accounts in your name and every dollar going to you. Here is what that involves and how to spot a publisher who is quietly keeping your book.',
  priceFrom: 'Included in every package, from $199',
  relatedSlugs: ['cover-design', 'editing', 'book-marketing'],

  blocks: [
    {
      kind: 'prose',
      heading: 'What self publishing means now',
      paragraphs: [
        'You own the book. You own the accounts. You keep the money. You pay other people to do the parts you cannot do yourself.',
        'That is different from how it used to work. Nobody prints a garage full of books any more. Your book is printed one copy at a time, when someone buys it.',
      ],
    },

    {
      kind: 'prose',
      heading: 'How a vanity press is different',
      paragraphs: [
        'A vanity press takes your money and also takes your book. They register the ISBN to themselves, open the retailer accounts in their name, and pay you a share of what comes in.',
        'It can look identical from the outside. The tell is ownership. Ask whose name goes on the ISBN and on the Amazon account. If the answer is not yours, walk away.',
      ],
    },

    {
      kind: 'list',
      heading: 'The words, in plain English',
      intro: 'Six terms cover most of what you will be asked to decide.',
      items: [
        {
          term: 'ISBN',
          detail:
            'The ID number for your book. Whoever is named on it is the publisher of record. It should be you or your imprint, never us. Each format needs its own.',
        },
        {
          term: 'Imprint',
          detail:
            'The publisher name printed inside the book. It can be anything you like. It costs nothing and it makes the book look less obviously self published.',
        },
        {
          term: 'Print on demand',
          detail:
            'A copy is printed when someone orders it. No stock, no upfront cost, no boxes in your hallway. The printing cost comes out of each sale.',
        },
        {
          term: 'Metadata',
          detail:
            'Your title, description, categories and keywords. It decides who ever finds the book. It matters more than most authors expect.',
        },
        {
          term: 'Proof copy',
          detail:
            'A real printed copy sent to you before the book goes on sale. Typos survive three rounds of on-screen proofreading and then jump off the page.',
        },
        {
          term: 'Wide distribution',
          detail:
            'Selling beyond Amazon: Apple Books, Barnes and Noble, Kobo, Google Play, plus libraries and bookshops. Lower royalty per sale, more places to be found.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Royalties, and where the printing cost comes out',
      paragraphs: [
        'On Amazon, an ebook priced between $2.99 and $9.99 earns you 70 percent. Outside that band it drops to 35 percent, which is why so many ebooks are $9.99.',
        'Print is different. You get 60 percent of the price, then the printing cost is taken off that. A 300 page paperback costs about $4.45 to print. At $14.99 you keep about $4.55.',
        'We take none of it. The money goes from the retailer to your bank account and never passes through us.',
      ],
    },

    {
      kind: 'steps',
      heading: 'How we publish your book',
      intro:
        'From a finished manuscript and cover, about six weeks. A lot of that is waiting for a printed proof to arrive.',
      steps: [
        {
          name: 'Formats and prices',
          detail:
            'We agree your trim size, which formats you want, your imprint name, and a price for each one.',
          timeframe: 'Week 1',
        },
        {
          name: 'Accounts opened in your name',
          detail:
            'You open the accounts with your own email, bank details and tax information, on a call with us. About ninety minutes. We are added afterwards and you can remove us in two clicks.',
          timeframe: 'Weeks 1 to 2',
        },
        {
          name: 'ISBNs registered to you',
          detail:
            'One per format, with you or your imprint as publisher. Included. If you already own ISBNs we use those and take the cost off your bill.',
          timeframe: 'Week 2',
        },
        {
          name: 'Interior layout',
          detail:
            'The manuscript becomes a real book: running heads, chapter openings, proper margins, page numbers that behave. The cover spine is then built to the final page count.',
          timeframe: 'Weeks 2 to 4',
        },
        {
          name: 'Upload and metadata',
          detail:
            'Files go up, along with the description, keywords, categories and your biography. We write a first draft of the description for you to approve.',
          timeframe: 'Week 4',
        },
        {
          name: 'Printed proof',
          detail:
            'A physical copy is posted to you, and one to us. We both read it. This is the step cheap packages leave out.',
          timeframe: 'Weeks 5 to 6',
        },
        {
          name: 'On sale',
          detail:
            'The ebook is usually live within 72 hours of approval, the paperback within a week. Other stores take two to eight weeks to show the listing.',
          timeframe: 'Weeks 6 to 7',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'Bookshops mostly will not stock a print on demand title',
      paragraphs: [
        'This is worth knowing before anyone promises otherwise. Shops buy on sale or return, at a discount they choose. Print on demand usually offers neither.',
        'What you can have is orderable: any shop can get your book for a customer who asks. Local shops will often stock a few copies for an author who walks in. Anyone guaranteeing shelf space in a national chain is not describing how the trade works.',
      ],
    },

    {
      kind: 'list',
      heading: 'What you have to do',
      intro: 'About four hours in total, spread over six weeks.',
      items: [
        {
          term: 'Open the accounts',
          detail:
            'Ninety minutes on a call, including the tax questions. It has to be you, because they are your accounts.',
        },
        {
          term: 'Read the printed proof',
          detail:
            'Two or three hours with a pen. Nobody else can catch a wrong date or a misspelled name.',
        },
        {
          term: 'Approve the description and prices',
          detail:
            'Thirty minutes. We draft, you approve or rewrite.',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'Ask every publisher these',
      intro: 'The first two are the ones that matter most.',
      items: [
        {
          term: 'Whose name is on the ISBN?',
          detail:
            'It must be yours or your imprint. If it is theirs, they are the publisher and you are not.',
        },
        {
          term: 'Whose name is on the retail accounts?',
          detail:
            'Yours, with your bank details. If they hold the account, they hold your money and your listing.',
        },
        {
          term: 'What percentage do you take?',
          detail:
            'Ours is zero. Anyone taking a cut of royalties for a service you already paid for is charging you twice.',
        },
        {
          term: 'What do I keep if I leave?',
          detail:
            'You should keep everything: accounts, ISBNs, files, listings. The book should not even notice you left.',
        },
      ],
    },
  ],

  faqs: [
    {
      question: 'Can I use ISBNs I already bought?',
      answer: [
        'Yes, and we would rather you did. We use yours and take the cost off your invoice.',
        'If you bought a block, keep them together. Having your whole list under one publisher name looks tidier to the trade.',
      ],
    },
    {
      question: 'How long until my book is actually buyable?',
      answer: [
        'From a finished manuscript and cover, about six weeks. The ebook goes live within 72 hours of approval, the paperback within a week.',
        'The other stores take two to eight weeks to show it. That is their queue, not ours, which is why we set launch dates from the print date.',
      ],
    },
    {
      question: 'Can I change the cover or price after the book is out?',
      answer: [
        'Yes, any time, usually live within a couple of days. Nothing about publishing is permanent except the ISBN.',
        'Changing the price is a normal thing to test. Changing the cover is the cheapest fix when a book gets traffic but no sales.',
      ],
    },
    {
      question: 'What happens if SG Publication disappears tomorrow?',
      answer: [
        'Your book keeps selling and you keep getting paid. That is the point of putting everything in your name.',
        'You hold the accounts, the ISBNs and the files. There is nothing for us to switch off.',
      ],
    },
  ],
}
