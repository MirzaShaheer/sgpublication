import type { ServicePage } from './types'

/**
 * Author website, the long form page.
 *
 * Search intent: "author website design". The reader is usually choosing
 * between a template they build themselves and paying somebody, so the page is
 * honest that a template is often the right answer. What it argues for instead
 * is ownership of the domain and the list.
 *
 * Kept short and plain on purpose.
 */

export const authorWebsite: ServicePage = {
  slug: 'author-website',
  h1: 'Author website design',
  lede: 'A fast, simple site that sells the book and collects reader emails you own. Built on your domain, your hosting and your mailing list account.',
  priceFrom: 'Included in the $999 Enterprise package',
  relatedSlugs: ['book-marketing', 'publishing', 'cover-design'],

  blocks: [
    {
      kind: 'prose',
      paragraphs: [
        'An author site has three jobs. Make someone who just heard you on a podcast buy the book. Capture the email of the person who is interested but not today. Answer a journalist or event booker without them having to email you.',
        'Everything else is decoration. A site with a slideshow, two blog posts from 2023 and no email signup is worse than no site: it shows a project someone gave up on.',
        'It is also the only part of your publishing life nobody can take away. Store listings get suspended and social accounts get closed with no appeal. A domain and a mailing list are yours.',
      ],
    },

    {
      kind: 'list',
      heading: 'What a site needs, and what it does not',
      intro: 'The list is short on purpose. Most extras are features nobody uses.',
      items: [
        {
          term: 'Buy links for every store',
          detail:
            'Not just Amazon. Paperback, hardback, ebook and audio, wherever you are listed. Readers are loyal to their own shop, and one link quietly loses the rest.',
        },
        {
          term: 'An email signup with a reason',
          detail:
            'Nobody wants "updates". A first chapter or a template that solves one real problem gets signups. The list is the most valuable thing on the site.',
        },
        {
          term: 'A press kit people can use',
          detail:
            'Your bio in three lengths, a high resolution photo, the cover art, and five questions an interviewer can ask. A producer choosing between two guests books the one whose materials are already there.',
        },
        {
          term: 'Speed on a phone',
          detail:
            'Most visitors arrive on a phone, seconds after hearing your name. A page taking six seconds loses a lot of them. Ours load in under two.',
        },
        {
          term: 'What to leave out',
          detail:
            'A blog you will not write. A slideshow. A shop selling signed copies, unless you really will go to the post office every week.',
        },
      ],
    },

    {
      kind: 'callout',
      heading: 'Should you just build it yourself?',
      paragraphs: [
        'Honestly, sometimes yes. One book, a weekend and some patience, and a template site will do the job for the price of the subscription.',
        'Pay someone when the site has to work: when you are being booked to speak, when the list is the point, when there are several books, or when you know you will never sit down and do it.',
        'What we would argue against is paying four figures for a template with your name typed into it. If that is what you want, we will tell you which tool to use and you can spend the money elsewhere.',
      ],
    },

    {
      kind: 'steps',
      heading: 'How it gets built',
      intro: 'Three to four weeks. The accounts step comes first, because it is the part that protects you.',
      steps: [
        {
          name: 'Accounts in your name',
          detail:
            'Domain, hosting and mailing list registered to you with your billing details. We are added as a collaborator and you can remove us in two clicks.',
          timeframe: 'Week 1',
        },
        {
          name: 'Structure and words',
          detail:
            'We agree the pages and write them: a home page that sells the book in one screen, an about page that is a story rather than a CV, and the press kit.',
          timeframe: 'Weeks 1 to 2',
        },
        {
          name: 'Design from your cover',
          detail:
            'The site takes its type and colour from the book, so someone arriving from a store knows they are in the right place.',
          timeframe: 'Week 2',
        },
        {
          name: 'Build and email setup',
          detail:
            'The signup is connected end to end: form, welcome email, and the thing you promised actually arriving. We test it with real addresses on real phones.',
          timeframe: 'Week 3',
        },
        {
          name: 'Search, speed and access',
          detail:
            'Page titles, a sitemap, and a check that the site works with a keyboard and a screen reader. Then a speed pass on a slow connection.',
          timeframe: 'Week 3',
        },
        {
          name: 'Handover',
          detail:
            'A recorded thirty minute walkthrough showing you how to change text, add a book and email your list. The recording is yours to keep.',
          timeframe: 'Week 4',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What you have to do',
      paragraphs: [
        'Six to ten hours, mostly in week one. The bio and the reason you wrote the book have to come from you, or it reads like someone else wrote it.',
        'You also need a decent photo. Not a cropped wedding picture. A photographer for an hour costs a couple of hundred dollars, and that image follows you onto every podcast page and conference programme for years.',
        'After launch the only real obligation is the mailing list. Write to it four times a year and it is an asset. Never write to it and the first email after two years gets marked as spam.',
      ],
    },

    {
      kind: 'list',
      heading: 'What you keep paying after launch',
      intro: 'These go to the providers, not to us, and they continue whether or not we are involved.',
      items: [
        {
          term: 'The domain',
          detail: 'About $15 a year.',
        },
        {
          term: 'Hosting',
          detail: 'Free up to about $20 a month, depending on the platform.',
        },
        {
          term: 'Mailing list',
          detail:
            'Usually free up to around a thousand subscribers, then $20 to $40 a month.',
        },
      ],
    },

    {
      kind: 'list',
      heading: 'Ask any web designer these',
      intro: 'The first has stranded more authors than everything else here combined.',
      items: [
        {
          term: 'Whose name is on the domain and hosting?',
          detail:
            'It must be yours. A domain registered to an agency is the commonest way an author loses their own site, and it is discovered when nobody answers the email.',
        },
        {
          term: 'Who owns the mailing list?',
          detail:
            'The account should be yours and the contacts exportable whenever you want. A list you cannot take with you is not your list.',
        },
        {
          term: 'What happens if you disappear?',
          detail:
            'A good answer names the platform and confirms you have the logins. If only they can edit the site, you are renting a page.',
        },
      ],
    },

    {
      kind: 'prose',
      heading: 'What goes wrong',
      paragraphs: [
        'Nobody signs up. Almost always the offer, not the form. We change what you are giving away rather than the button colour, and we test that the email actually arrives.',
        'A buy link goes dead. The worst failure on the whole site. Buy links live in one place so a change is made once, and the walkthrough shows you where.',
        'Someone says the site needs more on it. Adding sections almost always means fewer people reach the buy links. Usually the site is fine and the traffic is the problem, which is a marketing conversation.',
      ],
    },
  ],

  faqs: [
    {
      question: 'Do I need a site if my book is on Amazon?',
      answer: [
        'You need one for the person who heard your name and searched for you rather than the book. If nothing of yours is there, they land somewhere else.',
        'With no promotion at all, a site adds little. The moment there is a podcast or an article, it catches everything they produce.',
      ],
    },
    {
      question: 'What do you build it on?',
      answer: [
        'Whatever fits, and we will tell you why. Most author sites are best on a mainstream builder, because you can edit them forever without us.',
        'What we will not do is build something only we can maintain. That is how an author ends up unable to change their own bio.',
      ],
    },
    {
      question: 'Can you move a site I already have?',
      answer: [
        'Yes, and it is often cheaper than starting again. The usual work is getting the domain into your name, rescuing the list, and rewriting the home page.',
        'We will look first and tell you whether it is worth moving or replacing. Sometimes it needs two hours, not a project.',
      ],
    },
    {
      question: 'What if I write a second book?',
      answer: [
        'The structure assumes you will. Adding a book is a page and some links, and the walkthrough covers doing it yourself in about twenty minutes.',
        'If you would rather we did it, it is a small fixed fee, not a new project.',
      ],
    },
  ],
}
