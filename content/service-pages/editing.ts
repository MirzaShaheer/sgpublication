import type { ServicePage } from './types'

/**
 * Editing, the long form page.
 *
 * Search intent: "book editing services". Editing is the easiest publishing
 * service to fake, because a buyer cannot see the work. So the page teaches the
 * four standard pass names first: knowing them is what lets somebody compare
 * two quotes at all.
 *
 * Kept short and plain on purpose. Short sentences, no jargon left undefined,
 * and nothing said twice.
 */

export const editing: ServicePage = {
  slug: 'editing',
  h1: 'Book editing and proofreading services',
  lede: 'Three passes by three different editors: structure, then sentences, then errors. You see a free sample edit of your own pages before you pay anything.',
  priceFrom: 'Included in every package, from $199',
  relatedSlugs: ['ghostwriting', 'cover-design', 'publishing'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'Editing is not one job. It is three or four separate passes, done in order, usually by different people.',
        'Every quote you get will use the names below. Learn them and you can compare prices properly. A quote that just says "professional editing" is hoping you cannot.',
      ],
    },

    {
      kind: 'list',
      heading: 'The four passes',
      intro: 'In the order they happen. Most books do not need all four.',
      items: [
        {
          term: 'Developmental edit',
          detail:
            'The big one. An editor reads the whole book and tells you what is working and what is not. Is the order right? Does chapter nine need to exist? You get a letter of eight to fifteen pages. Nothing is rewritten yet, because there is no point polishing sentences that may get cut.',
        },
        {
          term: 'Line edit',
          detail:
            'Sentence by sentence. Rhythm, repetition, clarity, the four paragraphs that say the same thing. A line editor works inside your voice, not over it. This is the pass that makes writing feel professional.',
        },
        {
          term: 'Copy edit',
          detail:
            'Correctness and consistency. Grammar and punctuation, but also: is it Sarah in chapter two and Sara in chapter eleven? You get a style sheet listing every choice made, so the next person follows the same rules.',
        },
        {
          term: 'Proofread',
          detail:
            'The last look, done after the book is laid out into pages. Half of what a proofreader catches only exists once the book is in pages: a heading stranded at the bottom, a wrong running head, a missing page number.',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'Why it cannot be one pass',
      paragraphs: [
        'One person cannot judge structure and hunt typos at the same time. Reading for shape means skimming sentences. Reading for errors means losing the shape.',
        'It is also the wrong order. Fixing commas in a chapter that gets cut is wasted money. Structure first, sentences second, errors last.',
      ],
    },

    {
      kind: 'steps',
      heading: 'How an edit runs',
      intro:
        'Timings are for a 50,000 word book, about 200 printed pages. You approve each pass before the next one starts.',
      steps: [
        {
          name: 'Free sample edit',
          detail:
            'Send 1,500 words from the middle of your book, not the opening. We edit it and send it back in tracked changes. You can walk away.',
          timeframe: '3 working days',
        },
        {
          name: 'Assessment',
          detail:
            'An editor reads the whole book and says which passes it actually needs. Sometimes that means talking you out of spending money.',
          timeframe: '1 week',
        },
        {
          name: 'Developmental edit',
          detail:
            'The read, the letter, and a call to go through it. Then you rewrite. Your rewrite time is usually the longest part.',
          timeframe: '3 weeks, then your rewrite',
        },
        {
          name: 'Line edit',
          detail:
            'A different editor, in tracked changes. You accept or reject each change. Expect to spend six to ten hours on this.',
          timeframe: '2 to 3 weeks',
        },
        {
          name: 'Copy edit',
          detail:
            'A third pair of eyes, plus the style sheet. Questions only you can answer are left as comments.',
          timeframe: '2 weeks',
        },
        {
          name: 'Layout, then proofread',
          detail:
            'The book is typeset into pages. Only then does the proofreader read it, on the pages themselves.',
          timeframe: '2 weeks',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'What changes the work',
      intro:
        'Editing is included in all three packages, from $199. These are the things that change how much of it your book needs.',
      items: [
        {
          term: 'The state of the draft',
          detail:
            'The biggest factor. A clean draft costs less to edit than one that needs rebuilding. This is why we read it first and quote second.',
        },
        {
          term: 'How many passes you need',
          detail:
            'A well organised draft may need only a copy edit and a proofread, not all four. We will say so when it is true.',
        },
        {
          term: 'Writing in a second language',
          detail:
            'Usually needs a heavier line edit, because idiom takes more work than grammar. It costs more. The aim is to keep your voice, not flatten it.',
        },
        {
          term: 'Speed',
          detail:
            'Good editors are booked three to five weeks ahead. If a company can start tomorrow, ask why their editors are free.',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'How to spot a good editor',
      intro: 'Ask anyone these, us included.',
      items: [
        {
          term: 'Will you edit my pages before I pay?',
          detail:
            'It should be yes, and free. A sample edit of your own writing tells you more in ten minutes than any portfolio.',
        },
        {
          term: 'Which pass am I buying?',
          detail:
            'They should say developmental, line, copy or proof. Anyone avoiding those words is hoping you cannot compare prices.',
        },
        {
          term: 'Do I get tracked changes and approve every edit?',
          detail:
            'Must be yes to both. A clean file with the changes baked in is a rewrite you cannot inspect.',
        },
        {
          term: 'Is the proofread on the typeset pages or the Word file?',
          detail:
            'Much of the industry uses the Word file, because it is cheaper. Ours is on the laid out pages. That is what the word proofread means.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What goes wrong',
      paragraphs: [
        'The letter lands hard. Being told your book starts on page 90 is correct, useful, and horrible to read. We send it, then wait three days before the call. Most people hate it on day one and agree by day four. If you still disagree, you win. It is your book.',
        'An editor edits your voice out. Tell us at the first batch, not at the end. We move the book to a different editor at no cost, working from your original file.',
        'A typo survives. It happens in traditionally published books too. We catch above 99.5 percent, which on a 50,000 word book can leave one or two. Tell us and we fix the file and update the stores free.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Can I just have a proofread to save money?',
      answer: [
        'Sometimes that is the right call. If good readers have read it, you have revised twice, and nobody has complained about the structure, a proofread may be all it needs.',
        'What it will not do is fix a structural problem. Removing typos from a book that starts in the wrong place gives you a clean book people still put down. We will tell you which one you have, free.',
      ],
    },
    {
      question: 'Will editing change my voice?',
      answer: [
        'A good line edit makes your voice more consistent, not less yours. What gets removed is usually habit: the same opening in every paragraph, the word you use forty times.',
        'You can reject any change, because it all comes back in tracked changes. Editors expect that.',
      ],
    },
    {
      question: 'Do you edit fiction?',
      answer: [
        'Yes, but most of our work is business books, memoir and self help. A fantasy series has conventions a specialist knows and we may not.',
        'If we are not right for your book, we will say so on the assessment call rather than take the work.',
      ],
    },
    {
      question: 'I used grammar software. Do I still need a copy editor?',
      answer: [
        'Software catches a lot of the mechanical errors. What it cannot do is consistency across 200 pages, and that is most of what a copy edit is.',
        'It also cannot tell when a rule is wrong for your book. Use it before you send the manuscript, though. A cleaner draft is a cheaper edit.',
      ],
    },
  ],
}
