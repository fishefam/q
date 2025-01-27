import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: '*', port: '', protocol: 'https', search: '' },
    ],
  },
}

export default nextConfig
