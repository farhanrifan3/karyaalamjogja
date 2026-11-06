import type { Metadata } from "next";
import Link from "next/link";

import { CatalogClient } from "@/components/catalog/CatalogClient";
import { ChatbotWidget } from "@/components/ui/ChatbotWidget";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  ChevronRight,
  LayersIcon,
  RulerIcon,
  SparkleIcon,
} from "@/components/site/icons";
import { getCatalogFromSupabase } from "@/lib/supabase-catalog";

export const metadata: Metadata = {
  title: "Katalog Batu Alam — Karya Alam",
  description:
    "Katalog batu alam Karya Alam: andesit, candi, kali, koral, palimanan, dan batu tempel acak. Lihat ukuran, motif, dan karakter material, lalu tanyakan ketersediaan via WhatsApp.",
  alternates: {
    canonical: "/katalog",
  },
};

type CatalogPageProps = {
  searchParams: Promise<{ kategori?: string }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const [catalog, params] = await Promise.all([getCatalogFromSupabase(), searchParams]);
  const initialCategory = catalog.categories.some(
    (category) => category.id === params.kategori || category.slug === params.kategori,
  )
    ? catalog.categories.find(
        (category) =>
          category.id === params.kategori || category.slug === params.kategori,
      )?.id
    : "";

  const sizeCount = new Set(
    catalog.items.flatMap((item) => item.sizes.map((size) => size.label)),
  ).size;

  return (
    <>
      <a className="skip" href="#main">
        Lompat ke konten
      </a>

      <SiteHeader variant="catalog" />

      <main id="main">
        <div className="page-head">
          <div className="wrap">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Beranda</Link>
              <ChevronRight />
              <span aria-current="page">Katalog batu</span>
            </nav>
            <h1>Katalog batu alam.</h1>
            <p className="lead">
              Batu dari pangkalan sendiri, dengan ukuran dan motif yang bisa
              disesuaikan. Katalog menampilkan material dan karakter; harga
              serta stok dikonfirmasi lewat WhatsApp.
            </p>
            <div className="page-head__meta">
              <span>
                <LayersIcon className="ic ic--sm" />
                {catalog.categories.length} kategori batu
              </span>
              <span>
                <RulerIcon className="ic ic--sm" />
                {sizeCount > 0
                  ? `${sizeCount} pilihan ukuran`
                  : "Ukuran menyesuaikan"}
              </span>
              <span>
                <SparkleIcon className="ic ic--sm" />
                Motif polos, urat, dan acak
              </span>
            </div>
          </div>
        </div>

        <CatalogClient
          categories={catalog.categories}
          items={catalog.items}
          initialCategory={initialCategory ?? ""}
        />
      </main>

      <SiteFooter />
      <ChatbotWidget />
    </>
  );
}
