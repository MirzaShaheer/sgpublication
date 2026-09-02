import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * Standalone output is for the Dockerfile: it emits a server bundle the
   * runtime image can carry on its own. Vercel does not want it. Vercel builds
   * its own output from the app and sets VERCEL in the build environment, so
   * the option is dropped there and the platform is left to do it its way.
   */
  output: process.env.VERCEL ? undefined : 'standalone',
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
