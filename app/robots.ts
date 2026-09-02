import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

/**
 * robots.txt.
 *
 * Everything is crawlable except /api, which holds the lead endpoint. There is
 * nothing to index there and a crawler hitting it only writes junk rows.
 * The sitemap reference has to be an absolute URL: it is the one line in
 * robots.txt that is not resolved relative to the host.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
