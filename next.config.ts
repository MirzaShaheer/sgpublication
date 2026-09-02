import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * Standalone output is for the Dockerfile: it emits a server bundle the
   * runtime image can carry on its own. Vercel does not want it. Vercel builds
   * its own output from the app and sets VERCEL in the build environment, so
   * the option is dropped there and the platform is left to do it its way.
   */
  output: process.env.VERCEL ? undefined : 'standalone',
  /**
   * public/logo.png is read from disk by app/opengraph-image.tsx, through a
   * path built from process.cwd(), which output file tracing cannot follow.
   * Vercel serves public/ from its CDN rather than from the function
   * filesystem, so without this the two card routes would render without the
   * seal if either ever rendered at request time rather than at build.
   *
   * Scoped to those two routes on purpose. The file is 600KB and there is no
   * reason for it to sit in the bundle of every other function.
   */
  outputFileTracingIncludes: {
    '/opengraph-image': ['./public/logo.png'],
    '/twitter-image': ['./public/logo.png'],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    // The seal is the only optimised image on the site and it asks for 90:
    // it renders between 34px and 92px, where the default 75 shows its
    // gradients banding. Next 16 rejects any quality not listed here.
    qualities: [75, 90],
  },
}

export default nextConfig
