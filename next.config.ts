import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Unggah foto katalog lewat server action (maksimal 4 MB + overhead).
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
