import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "isobrain-space.nyc3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "pr3detorapp-media-storage.s3.us-east-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "bucket.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
