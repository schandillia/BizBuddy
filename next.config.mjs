/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
  output: "standalone",
}

export default nextConfig
