export const site = {
  name: 'SG Publication',
  legalName: 'SG Publication LLC',
  /**
   * The parent company. SG Publication is its book publishing division, and
   * the SG in the name is short for it, which is also why the seal's own
   * wordmark reads Selune Global Publication while the site says SG.
   */
  parent: 'Selune Global',
  tagline: 'We turn your idea into a book people buy.',
  description:
    'A full service book publishing house. We take first time authors from a raw idea to a finished book that is edited, designed, published, marketed and managed.',
  // PLACEHOLDER contact details. Replace before launch.
  phone: '+1 (555) 014-8820',
  phoneHref: '+15550148820',
  email: 'hello@sgpublication.com',
  address: {
    street: '1200 Chapter House, Suite 4',
    locality: 'Austin',
    region: 'TX',
    postalCode: '78701',
    country: 'US',
  },
  social: {
    instagram: 'https://instagram.com/sgpublication',
    linkedin: 'https://linkedin.com/company/sgpublication',
    youtube: 'https://youtube.com/@sgpublication',
  },
  founded: '2016',
} as const

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://sgpublication.com'
).replace(/\/$/, '')

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export type NavItem = { href: string; label: string }

/**
 * The masthead nav.
 *
 * Every item now points at a real page. These were home page anchors while
 * those pages did not exist; a nav item that scrolls is better than one that
 * 404s, but a nav item that goes where its label says is better than both.
 *
 * The home page still carries the matching section ids, so the sections
 * remain linkable, they are simply no longer where the masthead sends people.
 */
export const primaryNav: NavItem[] = [
  { href: '/services', label: 'Services' },
  { href: '/packages', label: 'Packages' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/published', label: 'Published books' },
  { href: '/about', label: 'About' },
]

/**
 * Where every "book a call" control on the site points.
 *
 * One constant rather than a literal in a dozen components, so the whole site
 * moves together. It is the contact page: a button that says "book a free
 * call" has to land somewhere you can actually book one, not on a form section
 * halfway down the home page.
 */
export const contactHref = '/contact'

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Services',
    items: [
      { href: '/services', label: 'All services' },
      { href: '/services/ghostwriting', label: 'Ghostwriting' },
      { href: '/services/editing', label: 'Editing' },
      { href: '/services/cover-design', label: 'Cover design' },
      { href: '/services/publishing', label: 'Publishing and distribution' },
      { href: '/services/audiobook', label: 'Audiobook production' },
      { href: '/services/book-marketing', label: 'Book marketing' },
      { href: '/services/author-website', label: 'Author website' },
    ],
  },
  {
    heading: 'Start here',
    items: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/packages', label: 'Packages and pricing' },
      { href: '/published', label: 'Published books' },
      { href: '/faq', label: 'Questions and answers' },
      { href: contactHref, label: 'Book a free call' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { href: '/about', label: 'About SG Publication' },
      { href: '/blog', label: 'Writing and publishing notes' },
      { href: contactHref, label: 'Contact' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/terms', label: 'Terms of service' },
    ],
  },
]
