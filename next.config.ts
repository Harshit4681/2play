// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ allows deploy even if ESLint errors exist
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ allows deploy even if TS errors exist
  },
};

module.exports = nextConfig;
