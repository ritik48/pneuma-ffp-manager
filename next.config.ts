import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL("https://rrbuckets.s3.us-east-1.amazonaws.com/**")],
  },
};

export default nextConfig;
