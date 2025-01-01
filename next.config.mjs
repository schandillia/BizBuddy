// next.config.mjs
import withBundleAnalyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Use the SWC compiler for faster builds and smaller bundles
  experimental: {
    scrollRestoration: true, // Improves UX for page reloads/navigation
  },
  distDir: ".build", // Custom build output folder

  // Your other Next.js config options here, if any
}

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig)

export default config
