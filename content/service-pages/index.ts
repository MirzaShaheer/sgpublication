import type { ServicePage, ServicePageRegistry, ServiceSlug } from './types'

import { audiobook } from './audiobook'
import { authorWebsite } from './author-website'
import { bookMarketing } from './book-marketing'
import { coverDesign } from './cover-design'
import { editing } from './editing'
import { ghostwriting } from './ghostwriting'
import { publishingPage } from './publishing'

/**
 * The long form pages, keyed by slug.
 *
 * The annotation is doing real work. `ServicePageRegistry` is a Record over the
 * closed `ServiceSlug` union, so adding a service to that union without writing
 * its page fails to compile here rather than rendering an empty page in
 * production. The route in app/services/[slug]/page.tsx reads only through
 * `getServicePage` below, so a missing entry can never reach a visitor.
 */
export const servicePages: ServicePageRegistry = {
  ghostwriting,
  editing,
  'cover-design': coverDesign,
  publishing: publishingPage,
  audiobook,
  'book-marketing': bookMarketing,
  'author-website': authorWebsite,
}

/** True when a string is one of the seven slugs the registry covers. */
export function isServiceSlug(slug: string): slug is ServiceSlug {
  return Object.prototype.hasOwnProperty.call(servicePages, slug)
}

/**
 * The page for a slug, or undefined. Takes a plain string because the value
 * arrives from a route parameter, which is untrusted until it is checked.
 */
export function getServicePage(slug: string): ServicePage | undefined {
  return isServiceSlug(slug) ? servicePages[slug] : undefined
}

export type { ServicePage, ServicePageBlock, ServiceSlug } from './types'
