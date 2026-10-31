import type { Metadata, Viewport } from "next";
import { Archivo, Geist } from "next/font/google";
import Script from "next/script";

import { site } from "@/lib/site";

import "./scrollcraft.css";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const title = "Karya Alam · Batu, air, dan tanah";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.description,
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
  themeColor: "#081715",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${archivo.variable} ${geist.variable}`}>
      <body>
        <noscript>
          <style>{`[data-sc-in],[data-sc-stagger]>*{opacity:1;transform:none}[data-sc-reveal]{clip-path:none!important}`}</style>
        </noscript>

        {children}

        <Script src="/scrollcraft.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
