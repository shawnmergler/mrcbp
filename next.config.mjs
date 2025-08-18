/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // keep anything else you need here
    serverActions: { allowedOrigins: ['*'] },
  },
};
export default nextConfig;
