import { withContentCollections } from '@content-collections/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your next.js config
  experimental: {
    viewTransitions: true,
  },
}

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig)
