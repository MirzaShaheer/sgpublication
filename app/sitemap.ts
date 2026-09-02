import type { MetadataRoute } from 'next'
import { services } from '@/content/services'
import { absoluteUrl } from '@/lib/site'

/**
 * The sitemap.
 *
 * Priority is relative, not absolute, so it only says which pages matter most
 * within this site: the home page, then the two pages an anxious first time
 * author actually converts on, packages and contact, then the service pages
 * that carry the search intent, then the reassurance pages, then the legal
 * pages last.
 *
 * lastModified is a single fixed constant rather than `new Date()`. A date
 * generated at build time changes on every deploy, which tells a crawler that
 * every page was rewritten when nothing was, and that is how a site teaches
 * Google to stop trusting its own sitemap. Bump this by hand when the content
 * genuinely changes.
 */
const RELEASE_DATE = new Date('2026-09-01T00:00:00.000Z')

/**
 * ASSUMPTION. The blog posts live in content/posts.ts, written by another
 * agent, and that module does not exist yet. A missing import is a build
 * failure rather than something that can be caught at runtime, so the three
 * slugs are listed here instead of derived.
 *
 * THESE MUST STAY IN SYNC WITH content/posts.ts. If a post slug changes there,
 * change it here in the same commit, or the sitemap will advertise a 404. Once
 * content/posts.ts is in the tree, replace this array with
 * `posts.map((post) => post.slug)` and delete this note.
 */
const BLOG_SLUGS = [
  'how-much-does-it-cost-to-publish-a-book',
  'what-is-an-isbn',
  'self-publishing-versus-traditional-publishing',
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  ) => ({
    url: absoluteUrl(path),
    lastModified: RELEASE_DATE,
    changeFrequency,
    priority,
  })

  return [
    entry('/', 1, 'weekly'),

    // The money pages. Pricing and the contact form are where a visit ends.
    entry('/packages', 0.9, 'monthly'),
    entry('/contact', 0.9, 'yearly'),

    // Services. The index, then one page per service, derived from the content
    // file so a new service appears in the sitemap the moment it is added.
    entry('/services', 0.9, 'monthly'),
    ...services.map((service) => entry(`/services/${service.slug}`, 0.8, 'monthly')),

    // Reassurance: how the work runs, what has been published, who we are.
    entry('/how-it-works', 0.8, 'monthly'),
    entry('/published', 0.7, 'monthly'),
    entry('/faq', 0.7, 'monthly'),
    entry('/about', 0.6, 'yearly'),

    // The blog index changes when a post lands. The posts themselves do not.
    entry('/blog', 0.6, 'weekly'),
    ...BLOG_SLUGS.map((slug) => entry(`/blog/${slug}`, 0.5, 'yearly')),

    entry('/privacy', 0.2, 'yearly'),
    entry('/terms', 0.2, 'yearly'),
  ]
}
