import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { site } from "@/lib/site";

import "./karya.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const title = "Karya Alam — Batu Alam, Kolam, Tebing & Taman Sejak 1986";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description:
    "Pangkalan batu alam, kolam, tebing, dan taman di Jl. Kapten Haryadi, Sleman sejak 1986. Konsultasi desain gratis, RAB jelas sebelum proyek, garansi kedap air 100% untuk kolam.",
  keywords: [
    "batu alam Yogyakarta",
    "kolam koi Sleman",
    "jasa kolam Yogyakarta",
    "tebing batu alam",
    "taman minimalis Yogyakarta",
    "landscape Yogyakarta",
    "Karya Alam",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: site.name,
    title,
    description: site.description,
    images: [
      {
        url: "/images/hero-garden.jpg",
        width: 1536,
        height: 1024,
        alt: "Ilustrasi taman Jepang dengan kolam koi dan air terjun batu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/images/hero-garden.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#235A10",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
