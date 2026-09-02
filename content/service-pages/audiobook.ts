import type { ServicePage } from './types'

/**
 * Audiobook production, the long form page.
 *
 * Search intent: "audiobook production services". The reader is usually
 * deciding between narrating it themselves and paying somebody, and has no
 * idea that the real cost of doing it themselves is the retakes.
 *
 * Kept short and plain on purpose.
 */

export const audiobook: ServicePage = {
  slug: 'audiobook',
  h1: 'Audiobook production services',
  lede: 'A narrator you pick, a studio recording checked line by line against your manuscript, and delivery to Audible, Spotify and Apple. You hold the rights and the royalty account.',
  priceFrom: 'Quoted per book. Not included in the packages.',
  relatedSlugs: ['publishing', 'book-marketing', 'ghostwriting'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'An audiobook is a performance of your book, not a recording of it. It also has to hit a technical standard that the stores check automatically.',
        'That is where most home-made audiobooks fail. A file that sounds fine on your laptop gets rejected for background noise you would never notice.',
        'For non fiction, audio is often fifteen to thirty percent of what a book earns. It reaches the person driving or at the gym who would never have sat down with the print edition.',
      ],
    },

    {
      kind: 'list',
      heading: 'The words, in plain English',
      intro: 'Five terms cover the decisions you will be asked to make.',
      items: [
        {
          term: 'Finished hour',
          detail:
            'One hour of completed audio, about 9,300 words. The whole industry prices in these. Divide your word count by 9,300 to get yours.',
        },
        {
          term: 'Narrator audition',
          detail:
            'Three to five narrators record the same two pages of your book, and you pick. It takes you twenty minutes and it is the most important choice in the project.',
        },
        {
          term: 'Punch and roll',
          detail:
            'How a professional fixes a fluffed line: stop, back up, record over it in one take. It is why a pro records two finished hours a day and an amateur records twenty minutes.',
        },
        {
          term: 'Proofing',
          detail:
            'Someone who is not the narrator listens to every minute with the manuscript open. This is the step cheap productions skip, and listeners mention it in reviews.',
        },
        {
          term: 'Exclusive or wide',
          detail:
            'Exclusive means Audible only, higher royalty, locked for twelve months. Wide means Audible, Spotify, Apple, Kobo and libraries at a lower rate each.',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'Should you narrate it yourself?',
      paragraphs: [
        'Sometimes yes. A memoir is often better in the voice it happened to, and listeners forgive an amateur delivery from an author telling their own story.',
        'But know the number. Narrating your own six hour book takes twenty five to forty hours in a booth, and you will hate the sound of your own voice around hour nine. That is normal, and it is why author-narrated projects stall more than any other kind.',
        'Our honest advice: use a professional for business, self help and anything instructional. Consider doing it yourself for memoir, and record one chapter before you commit.',
      ],
    },

    {
      kind: 'steps',
      heading: 'How it is produced',
      intro: 'Eight to twelve weeks from a finished manuscript. Casting and proofing take the time, not recording.',
      steps: [
        {
          name: 'Auditions',
          detail:
            'We agree the voice you want. Three to five narrators read two pages of your book. You choose, and you can ask for another round.',
          timeframe: 'Weeks 1 to 2',
        },
        {
          name: 'Pronunciation list',
          detail:
            'You record yourself saying every name, place and technical term. Twenty minutes on your phone, and the best value twenty minutes in the project.',
          timeframe: 'Week 2',
        },
        {
          name: 'Sample chapter',
          detail:
            'The narrator records one full chapter and you sign it off. Pace and energy only become obvious at chapter length.',
          timeframe: 'Week 3',
        },
        {
          name: 'Recording',
          detail:
            'About two finished hours a day. You do not need to attend. The narrator emails questions rather than guessing.',
          timeframe: 'Weeks 4 to 7',
        },
        {
          name: 'Proofing and fixes',
          detail:
            'A proofer logs every fault with a timecode and the narrator re-records those bits. Two to five percent of any book gets redone. That is normal.',
          timeframe: 'Weeks 7 to 9',
        },
        {
          name: 'Mastering and delivery',
          detail:
            'Each chapter is mastered to the store standard and checked by measurement, not by ear. Then files go up under your account.',
          timeframe: 'Week 10',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'Exclusive or wide, and why we usually say wide',
      paragraphs: [
        'Audible exclusivity pays 40 percent against 25 percent for wide, and locks the book to one shop for a year. On the face of it, exclusive wins.',
        'What that rate hides is libraries. They buy audiobooks at full price, and one library system buying a niche title can outweigh the royalty difference on its own. Exclusivity shuts that door. Spotify is not in the deal either.',
        'So our default is wide, and we say that knowing it makes our own numbers look worse. The exception is a first novel with no audience, where the Audible recommendations may be the only thing that finds it.',
      ],
    },

    {
      kind: 'list',
      heading: 'Ask any audiobook producer these',
      intro: 'The third one is the one nobody asks until it is too late.',
      items: [
        {
          term: 'Do I audition narrators on my own book?',
          detail:
            'A showreel tells you a narrator is good. It does not tell you they are right for your book.',
        },
        {
          term: 'Is proofing included, and who does it?',
          detail:
            'It should be someone other than the narrator. If proofing is an optional extra, the base quote is not a finished audiobook.',
        },
        {
          term: 'Who owns the master files?',
          detail:
            'You should. With the masters you can remaster or cut promo clips later without going back to anyone. Ours are handed over as a matter of course.',
        },
        {
          term: 'Whose name is on the account?',
          detail:
            'Yours, with royalties landing in your bank. If a producer holds it, you have a publisher, not a supplier.',
        },
      ],
    },
  ],

  faqs: [
    {
      question: 'How long is my book in finished hours?',
      answer: [
        'Divide your word count by about 9,300. A 45,000 word book is just under five finished hours.',
        'Send us the manuscript and we will give you the exact number with the quote, so you can check the maths yourself.',
      ],
    },
    {
      question: 'Can I use an AI voice instead?',
      answer: [
        'You can, and it costs a fraction. Stores accept synthetic narration and label it as such on the listing, so buyers see it before they buy.',
        'We do not recommend it for a book that carries your authority. It is a fair choice for a short reference book. If you want it, we will produce it properly and tell you plainly what the trade-off is.',
      ],
    },
    {
      question: 'How much does an audiobook earn?',
      answer: [
        'It varies more than any other format, and anyone quoting a figure without seeing your book is guessing.',
        'The cost comes back over years, not months. It makes sense for a book you intend to keep selling, and much less for one with a launch spike and nothing behind it.',
      ],
    },
    {
      question: 'Can I record it at home?',
      answer: [
        'Only if the room is quiet enough, and most are not. Stores measure background noise, and a fridge two rooms away will fail it however good your microphone is.',
        'Send us a test recording and we will tell you honestly. If it fails, studio time near you is usually cheaper than the gear people buy trying to fix a room.',
      ],
    },
  ],
}
