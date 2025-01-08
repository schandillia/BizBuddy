import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
  },
  output: "standalone",
}

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig)

export default config
