import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* SSR mode */
  output: 'standalone',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
