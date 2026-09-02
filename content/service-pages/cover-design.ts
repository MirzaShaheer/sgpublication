import type { ServicePage } from './types'

/**
 * Cover design, the long form page.
 *
 * Search intent: "book cover design services". Almost every dispute over a
 * cover is really a dispute about files: who owns the layered artwork, and
 * whether the licence covers a hardback. So the file questions lead.
 *
 * Kept short and plain on purpose.
 */

export const coverDesign: ServicePage = {
  slug: 'cover-design',
  h1: 'Book cover design services',
  lede: 'Two concepts, three rounds of changes, and a cover built to work as a thumbnail as well as in your hands. You get the print files and the layered artwork.',
  priceFrom: 'Included in every package, from $199',
  relatedSlugs: ['editing', 'publishing', 'book-marketing'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'A cover has one job, and it is not to be beautiful. It has to tell a reader in about a second what kind of book this is and whether it is for them.',
        'Almost nobody sees your cover full size. They see it as a thumbnail in a search result, next to eleven others. If the title cannot be read at that size, the book is invisible.',
        'So we design at thumbnail size first and scale up. That is the opposite of how most people work, and it is the main difference between a cover that sells and one that was designed on a big monitor.',
      ],
    },

    {
      kind: 'list',
      heading: 'The words, in plain English',
      intro: 'Five terms cover most of it.',
      items: [
        {
          term: 'Trim size',
          detail:
            'The size of the finished book. Six by nine inches is standard for non fiction. It has to be decided before the inside pages are laid out.',
        },
        {
          term: 'Spine width',
          detail:
            'Worked out from your final page count and the exact paper used. Guess it and the title wraps onto the front. You find out when the proof arrives.',
        },
        {
          term: 'Full wrap',
          detail:
            'Back cover, spine and front in one file, which is what a printer needs. An ebook needs only the front. These are two separate things, so check a quote covers both.',
        },
        {
          term: 'Layered source file',
          detail:
            'The working file, with the text and image still editable. Ask for it in writing. Without it you have to go back to your designer for every future change.',
        },
        {
          term: 'Where the art comes from',
          detail:
            'Stock is a licensed photo, and the licence has limits worth reading. Commissioned art is drawn for you and costs more. We tell you in writing which is on your book.',
        },
      ],
    },

    {
      kind: 'steps',
      heading: 'How a cover gets made',
      intro: 'Three to four weeks. The research week is not padding.',
      steps: [
        {
          name: 'Brief and research',
          detail:
            'You tell us the book, the reader, and three covers you like and three you hate. We put the top forty books in your category on one board.',
          timeframe: 'Week 1',
        },
        {
          name: 'Two concepts',
          detail:
            'Two different ideas, not one idea in two colours. Shown full size, as a thumbnail, and on a book mockup.',
          timeframe: 'Week 2',
        },
        {
          name: 'You pick one',
          detail:
            'We develop the one you choose. If neither is right, we go back to the brief once at no charge.',
          timeframe: 'Week 2',
        },
        {
          name: 'Three rounds of changes',
          detail:
            'Each round is one set of notes from you. Rounds refine the cover you picked, not switch to the other one.',
          timeframe: 'Weeks 3 to 4',
        },
        {
          name: 'Thumbnail check',
          detail:
            'We drop your cover into a real search grid next to its real competitors. If it disappears, we change it.',
          timeframe: 'Week 4',
        },
        {
          name: 'Print files and proof',
          detail:
            'The full wrap built to your page count, the ebook cover, and mockups. A printed proof is checked before the book goes on sale.',
          timeframe: 'Week 4',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'Your cover should look like its genre, not like you',
      paragraphs: [
        'Genre styles exist because readers use them to find their way. A business book in a plain serif, a thriller in bold type on black. That is signage, not a lack of imagination.',
        'Breaking the pattern costs you readers who will not recognise what they are looking at. When an author says their cover must not look like the others, the honest reason is usually that they have stared at it for a month and got bored. A reader sees it for one second.',
      ],
    },

    {
      kind: 'prose',
      heading: 'What you have to do',
      paragraphs: [
        'About six hours in total. An hour on the brief, an hour looking at the concepts, and half an hour per round writing notes.',
        'Say what feels wrong, not what to change. "The title feels too small to take seriously" is something a designer can fix five ways. "Make it twenty percent bigger" has one outcome, often not the one you wanted.',
        'Do not ask eleven friends. The average of eleven opinions is a cover nobody hates and nobody buys. Ask three people who read books in your category.',
      ],
    },

    {
      kind: 'list',
      heading: 'Ask any cover designer these',
      items: [
        {
          term: 'Do I own the artwork, and can I see the licence?',
          detail:
            'Some cheap covers use images licensed for digital only, which quietly means you cannot print a hardback. Ours assigns the design to you outright.',
        },
        {
          term: 'Will you give me the layered file?',
          detail:
            'Yes is the only good answer. Ours comes to you at handover with the fonts listed.',
        },
        {
          term: 'How do you work out the spine?',
          detail:
            'The answer should mention your page count and the paper. If not, they are guessing.',
        },
        {
          term: 'Is any of this made by AI?',
          detail:
            'Ask, and get it in writing. Ours is licensed stock or commissioned art by default. If you want generated art we will tell you what that means for copyright first.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What goes wrong',
      paragraphs: [
        'The title vanishes at thumbnail size. Usually the subtitle: eleven words set small. We fix it by cutting words, not shrinking type.',
        'The proof looks darker than the screen. Normal, and it is ink soaking into paper. If it is far off, we adjust and reprint.',
        'The page count changes after the cover is built. The spine has to be redone. We do that once free, which is why we ask you to hold late additions.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Can I put a photo of myself on the cover?',
      answer: [
        'For a memoir, often yes. For a business book, your photo usually belongs on the back. A face on the front reads as self published unless the face is already famous.',
        'We need the original camera file, not a copy from a phone or a social account.',
      ],
    },
    {
      question: 'What if I do not like either concept?',
      answer: [
        'We go back to the brief and do a third and fourth at no charge, once. That is in the agreement, not a favour.',
        'It happens about one project in fifteen, and the brief was usually the problem.',
      ],
    },
    {
      question: 'Who writes the back cover text?',
      answer: [
        'We do, and it is part of the wrap. About 150 words plus your short bio, written to sell rather than summarise.',
        'You approve it. Write it yourself if you prefer and we will lay it out.',
      ],
    },
    {
      question: 'Can I change the cover after publishing?',
      answer: [
        'Yes, on any store, usually within a couple of days.',
        'It is a normal tactic. If a book gets traffic but no sales, a new cover is the cheapest thing to try.',
      ],
    },
  ],
}
