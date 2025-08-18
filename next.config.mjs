/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
    serverActions: { allowedOrigins: ['*'] },
  },
};
export default nextConfig;
