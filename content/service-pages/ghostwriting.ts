import type { ServicePage } from './types'

/**
 * Ghostwriting, the long form page.
 *
 * Search intent: "book ghostwriting services". Someone typing that has usually
 * been quoted a number by somebody else and cannot tell whether it is fair.
 *
 * Written short and plain on purpose. Every term is defined the first time it
 * appears, sentences are kept near fifteen words, and nothing is said twice.
 * A first time author reading this on a phone should be able to skim it in two
 * minutes and still come away knowing what they are buying.
 */

export const ghostwriting: ServicePage = {
  slug: 'ghostwriting',
  h1: 'Book ghostwriting services',
  lede: 'A writer interviews you each week and writes the book in your voice. Your name is on the cover. You own every word.',
  priceFrom: 'Quoted per book. Not included in the packages.',
  relatedSlugs: ['editing', 'cover-design', 'publishing'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'A ghostwriter writes your book for you. You bring the stories and the know-how. They bring the writing.',
        'You get a finished manuscript in Word, usually 30,000 to 90,000 words. Your name goes on the cover. The copyright is yours. The writer signs an agreement saying they have no claim to it.',
        'This is not just typing up what you say. Talking into a recorder for forty hours gives you forty hours of talking. The value is in the choices: what the book is about, what order it goes in, and what gets cut.',
      ],
    },

    {
      kind: 'list',
      heading: 'Words you will hear, in plain English',
      intro: 'Four terms cover most of it.',
      items: [
        {
          term: 'Voice matching',
          detail:
            'Writing so the book sounds like you. It is built from your recorded interviews. If someone offers to write your book without recording you talking, you will get generic writing with your name on it.',
        },
        {
          term: 'Chapter batching',
          detail:
            'Chapters come to you two or three at a time, not all at the end. You read our writing in week six, not month five. A voice problem gets fixed across two chapters instead of twenty.',
        },
        {
          term: 'Chapter brief',
          detail:
            'A half page saying what a chapter needs to do, written before we write it. You approve it. Changing a brief takes ten minutes. Changing a written chapter takes two days.',
        },
        {
          term: 'Revision round',
          detail:
            'One full pass through the book with your notes applied. Two rounds are included. Read the whole draft first, then send all your notes together.',
        },
      ],
    },

    {
      kind: 'steps',
      heading: 'How it runs, week by week',
      intro:
        'These timings are for a 40,000 word book. A longer one takes longer, and we give you that number before you sign.',
      steps: [
        {
          name: 'Concept call',
          detail:
            'Ninety minutes, recorded. You talk about what you know. We check the twelve closest books and find the gap.',
          timeframe: 'Week 1',
        },
        {
          name: 'Outline and briefs',
          detail:
            'A chapter by chapter plan you can read in ten minutes. Nothing gets written until you approve it.',
          timeframe: 'Weeks 2 to 3',
        },
        {
          name: 'Interviews',
          detail:
            'About seventy five minutes a week on video, recorded. Ten to sixteen sessions for most books.',
          timeframe: 'Weeks 3 to 14',
        },
        {
          name: 'First chapters arrive',
          detail:
            'Two chapters, for you to read. If the voice is wrong, say so now. We change the writer at no cost at this point.',
          timeframe: 'Week 6',
        },
        {
          name: 'The rest, in batches',
          detail:
            'Two or three chapters every fortnight. You read each batch within a week and send notes.',
          timeframe: 'Weeks 8 to 18',
        },
        {
          name: 'Full draft, then two revisions',
          detail:
            'The whole book, front to back. You read it, send notes, and we work through them. Twice.',
          timeframe: 'Weeks 19 to 25',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'You need ninety minutes a week. If you cannot, wait a quarter.',
      paragraphs: [
        'Everything else on this site is work we take away and bring back done. This one needs you in the room every week for three months.',
        'Expect sixty to eighty hours in total: one interview a week, fifteen minutes on follow up questions, and two hours reading each batch. A book built from four rushed interviews reads like one.',
        'The main reason a book runs late is not the writer. It is chapters sitting unread for three weeks. If the next quarter is too busy, tell us and we will start you in the one after.',
      ],
    },

    {
      kind: 'list',
      heading: 'What moves the price',
      intro:
        'Ghostwriting sits outside the three packages, because the cost depends almost entirely on length. Send us the details and we will quote it. Four things move the number.',
      items: [
        {
          term: 'Length',
          detail:
            'The big one. A 30,000 word book takes about four months. A 90,000 word memoir takes about nine. Longer is not better.',
        },
        {
          term: 'What you already have',
          detail:
            'Notes, blog posts, recorded talks, half a draft. All of it cuts interview time. Send us what you have before we quote.',
        },
        {
          term: 'Research beyond you',
          detail:
            'Interviews with other people, archive work, or facts that must be checked. That is real hours and it costs more.',
        },
        {
          term: 'Speed',
          detail:
            'Three months instead of six means two interviews a week from you. It costs about twenty percent more. We will ask why the date matters first.',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'Ask any ghostwriter these',
      intro: 'Put the answers side by side. Ours are here, including the unflattering parts.',
      items: [
        {
          term: 'Who is writing my book, and can I read their work?',
          detail:
            'You want a name and two sample chapters from a book on sale. We name your writer before you sign and you meet them on a call.',
        },
        {
          term: 'How many hours do you need from me?',
          detail:
            'If the answer is under ten hours for a full book, ask how they plan to write in your voice.',
        },
        {
          term: 'What if I do not like the writing?',
          detail:
            'Ours: after the first batch, we change the writer at no cost. Later than that, we redo the affected chapters once. Beyond that, it is a paid extra round.',
        },
        {
          term: 'What is not included?',
          detail:
            'Ghostwriting is the manuscript only. Not the edit, cover, layout, ISBN or launch. Check whether a cheaper quote covers those.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What goes wrong',
      paragraphs: [
        'The voice comes back wrong. It usually shows up in the first batch as writing that is fine but too formal. We go back to your transcripts and rewrite. If the second try is still off, we change the writer.',
        'The book changes shape halfway through. Normal, not a failure. We stop, redo the outline, and tell you the new date and whether the price moves.',
        'You go quiet. We hold the project open for ninety days at no charge and pick up from the last approved batch.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Will my writer know my subject?',
      answer: [
        'Usually not deeply, and that is on purpose. They need to ask the simple question your reader would ask but your colleagues never would.',
        'We do match category. A memoir writer and a business book writer are different people. For technical, medical or legal books, we add an expert reviewer.',
      ],
    },
    {
      question: 'Can I write some chapters myself?',
      answer: [
        'Yes, and many authors do. A common split is you write the two closest to your heart and we write the rest. A line edit then makes it read as one voice.',
        'Tell us at the outline stage, not in month four.',
      ],
    },
    {
      question: 'What happens to my recordings?',
      answer: [
        'They stay in your project folder and you can download them any time, including after the book is out.',
        'We keep our copy for two years, then delete it. Ask us to delete it sooner and we will, within thirty days.',
      ],
    },
    {
      question: 'Do you use AI to write the book?',
      answer: [
        'Not to write it. A named human writes your book from your interviews, and the contract says so.',
        'We do use software to turn recordings into text, and editors use normal spellcheck. If you need it in writing, ask and we will give you a signed statement.',
      ],
    },
  ],
}
