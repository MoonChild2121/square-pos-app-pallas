/** @type {import('next').NextConfig} */
import withBundleAnalyzer from '@next/bundle-analyzer';
const nextConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})({  reactStrictMode: true,
  experimental: {
    serverActions: {},
    reactCompiler: true,
  },  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'items-images-sandbox.s3.us-west-2.amazonaws.com',
      },
    ],
  },
});

export default nextConfig;
