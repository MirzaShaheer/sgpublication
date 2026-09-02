/**
 * ============================================================================
 * THE THREE PACKAGES
 * ----------------------------------------------------------------------------
 * Contents and prices supplied by the client. Full prices are $399, $1,199 and
 * $1,999; all three currently run at half price, which is the number shown
 * first on the page.
 *
 * Feature lines are the service names only. The longer explanation of each one
 * was deliberately left out: the packages section is a price list, and a
 * reader comparing three columns is scanning, not reading.
 *
 * Tiers two and three inherit, so each lists only what it adds. The component
 * prints "Everything in X, plus" above the list, which is why nothing is
 * repeated down the three columns.
 * ============================================================================
 */

export type PackageTier = {
  slug: string
  name: string
  /**
   * The price actually charged today, in whole US dollars. This is the
   * discounted number, because it is the one the buyer pays.
   */
  price: number
  priceLabel: string
  /**
   * The full price, shown struck through beside the price above. Omit on a
   * tier that is not discounted and the strike through disappears with it.
   */
  fullPriceLabel?: string
  /** The saving, as shown on the tier. Only meaningful with fullPriceLabel. */
  discountLabel?: string
  /** Who the tier is for, in one line. */
  audience: string
  /** One or two short sentences positioning the tier. */
  summary: string
  timeframe: string
  /** Named as "everything in X, plus" on the comparison. */
  inherits?: string
  features: string[]
  promoted?: boolean
  /** Shown on the promoted tier as a small serif ribbon. */
  ribbon?: string
}

export const packages: PackageTier[] = [
  {
    slug: 'self-publishing-bundle',
    name: 'Self-Publishing and Management',
    price: 199,
    priceLabel: '$199',
    fullPriceLabel: '$399',
    discountLabel: 'Half price',
    audience: 'For authors with a finished manuscript.',
    summary:
      'Everything needed to get your book edited, designed, and on sale on Amazon and Kindle.',
    // TIMEFRAME ASSUMPTION. Not supplied with the package contents. Checked
    // against the steps on the publishing service page; adjust if wrong.
    timeframe: 'About 3 to 4 weeks',
    features: [
      'Proofreading and editing',
      'Interior formatting',
      'Custom cover design, eBook and full print wrap',
      'Publishing on Amazon and Kindle',
      'Print-on-demand setup',
      'Metadata and keyword optimisation',
      'ISBN and barcode registration',
      'Amazon author page setup',
      'Management support throughout',
    ],
  },
  {
    slug: 'multi-platform-growth',
    name: 'Multi-Platform and Author Growth',
    price: 599,
    priceLabel: '$599',
    fullPriceLabel: '$1,199',
    discountLabel: 'Half price',
    audience: 'For authors who want to sell beyond Amazon.',
    summary:
      'The same build, then out to every major store, into libraries and bookshops, in paperback and hardcover.',
    timeframe: 'About 4 to 6 weeks',
    inherits: 'Self-Publishing and Management',
    promoted: true,
    ribbon: 'Most authors choose this',
    features: [
      'Publishing on 7+ global platforms',
      'Expanded library and bookstore access',
      'Multi-format expansion, hardcover and paperback',
      'Promotional launch setup',
      'Ongoing author support after launch',
    ],
  },
  {
    slug: 'enterprise-global',
    name: 'Enterprise Global and Author Brand',
    price: 999,
    priceLabel: '$999',
    fullPriceLabel: '$1,999',
    discountLabel: 'Half price',
    audience: 'For authors building a brand around the book.',
    summary:
      'Worldwide distribution, your own website, and the marketing setup to sell direct at a better margin.',
    timeframe: 'About 6 to 8 weeks',
    inherits: 'Multi-Platform and Author Growth',
    features: [
      'Global distribution across 40+ platforms',
      'Custom author website development',
      'Author website SEO setup',
      'Keyword research and digital ad setup',
      'Direct-to-consumer sales on your own site',
    ],
  },
]

/** Carried beneath every tier, without exception. */
export const packageGuarantees: string[] = [
  'You keep 100 percent of your royalties',
  'Every account is registered in your name',
  'The price is fixed before we start',
]

export const packagesCopy = {
  heading: 'Three ways to work with us',
  lede: 'Pick the one that matches where your book is today. Between two? Ask, and we will say which fits, even when it is the cheaper one.',
  priceNote:
    'All three are running at half price. The price is fixed when you sign, and nothing is added to your bill without your say so.',
} as const
