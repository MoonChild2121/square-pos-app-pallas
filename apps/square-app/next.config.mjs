/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'items-images-sandbox.s3.us-west-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
