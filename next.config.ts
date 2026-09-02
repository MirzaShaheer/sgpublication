import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
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
