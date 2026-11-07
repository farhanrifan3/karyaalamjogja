import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Foto baru disimpan di bucket publik Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Unggah foto katalog lewat server action (maksimal 4 MB + overhead).
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
