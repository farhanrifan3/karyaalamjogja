"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import type { CatalogCategory, CatalogItem } from "@/lib/catalog";
import { whatsappLink } from "@/lib/whatsapp";
import { ChevronRight, CloseIcon, SearchIcon } from "@/components/site/icons";

type CatalogClientProps = {
  categories: CatalogCategory[];
  items: CatalogItem[];
  initialCategory?: string;
  brandName: string;
  whatsapp: string;
};

const COMPARISON_ROWS: Array<[string, string]> = [
  ["permukaan", "Permukaan"],
  ["kesan", "Kesan"],
  ["perawatan", "Perawatan"],
  ["cocokUntuk", "Cocok untuk"],
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function sizeSummary(item: CatalogItem): string {
  if (item.sizes.length === 0) {
    return "Ukuran menyesuaikan";
  }

  const labels = item.sizes
    .slice(0, 3)
    .map((size) => (size.satuan ? `${size.label} · ${size.satuan}` : size.label));

  return `${labels.join(" · ")}${
    item.sizes.length > 3 ? ` · +${item.sizes.length - 3} ukuran` : ""
  }`;
}

function ProductCard({
  item,
  categoryName,
  onOpen,
}: {
  item: CatalogItem;
  categoryName: string;
  onOpen: (item: CatalogItem) => void;
}) {
  return (
    <button
      className="product"
      type="button"
      onClick={() => onOpen(item)}
    >
      <span className="product__media">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          loading="lazy"
          sizes="(max-width: 720px) 78vw, 260px"
        />
        {item.label ? <span className="badge">{item.label}</span> : null}
      </span>
      <span className="product__body">
        <span className="product__cat">{categoryName}</span>
        <span className="product__name">{item.name}</span>
        <span className="product__sizes">{sizeSummary(item)}</span>
        {item.character ? (
          <span className="product__motif">{item.character}</span>
        ) : null}
        <span className="product__foot">
          Lihat detail
          <ChevronRight />
        </span>
      </span>
    </button>
  );
}

function CategoryRail({
  category,
  items,
  onOpen,
}: {
  category: CatalogCategory;
  items: CatalogItem[];
  onOpen: (item: CatalogItem) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section className="catalog-group" aria-labelledby={`kategori-${category.id}`}>
      <div className="catalog-group__head">
        <div>
          <h2 id={`kategori-${category.id}`}>
            {category.name.replace(/^Batu\s+/i, "")}
          </h2>
          {category.description ? (
            <p className="catalog-group__desc">{category.description}</p>
          ) : null}
        </div>
        <div className="rail-nav">
          <button
            type="button"
            className="rail-nav__btn"
            aria-label={`Geser ${category.name} ke kiri`}
            onClick={() => scroll(-1)}
          >
            <ChevronRight className="ic ic--sm rail-nav__icon--prev" />
          </button>
          <button
            type="button"
            className="rail-nav__btn"
            aria-label={`Geser ${category.name} ke kanan`}
            onClick={() => scroll(1)}
          >
            <ChevronRight className="ic ic--sm" />
          </button>
        </div>
      </div>

      <div className="product-rail" ref={railRef}>
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            categoryName={category.name}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}

export function CatalogClient({
  categories,
  items,
  initialCategory = "",
  brandName,
  whatsapp,
}: CatalogClientProps) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("");
  const [active, setActive] = useState<CatalogItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const sizes = useMemo(() => {
    const list: string[] = [];
    items.forEach((item) =>
      item.sizes.forEach((entry) => {
        if (!list.includes(entry.label)) list.push(entry.label);
      }),
    );
    return list;
  }, [items]);

  const categoryName = (id: string) =>
    categories.find((entry) => entry.id === id)?.name ?? "Batu alam";

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (category && item.categoryId !== category) return false;
      if (size && !item.sizes.some((entry) => entry.label === size)) return false;
      if (query) {
        const haystack = normalize(
          [
            item.name,
            item.description,
            item.character,
            categoryName(item.categoryId),
            item.sizes.map((entry) => entry.label).join(" "),
            item.use.join(" "),
          ].join(" "),
        );
        if (!haystack.includes(normalize(query))) return false;
      }
      return true;
    });
  }, [items, category, size, query, categories]);

  const grouped = useMemo(() => {
    const buckets = new Map<string, CatalogItem[]>();

    filtered.forEach((item) => {
      const list = buckets.get(item.categoryId) ?? [];
      list.push(item);
      buckets.set(item.categoryId, list);
    });

    return categories
      .map((entry) => ({
        category: entry,
        items: buckets.get(entry.id) ?? [],
      }))
      .filter((group) => group.items.length > 0);
  }, [filtered, categories]);

  function openProduct(item: CatalogItem) {
    setActive(item);
    dialogRef.current?.showModal();
  }

  function closeProduct() {
    dialogRef.current?.close();
  }

  function resetFilters() {
    setCategory("");
    setSize("");
    setQuery("");
  }

  const andesitItems = items.filter((item) => item.categoryId === "andesit");
  const comparisonSource = active?.comparison;

  return (
    <>
      <div className="filters">
        <div className="wrap filters__in">
          <div className="search">
            <SearchIcon />
            <label className="sr-only" htmlFor="searchInput">
              Cari batu berdasarkan nama
            </label>
            <input
              id="searchInput"
              type="search"
              placeholder="Cari batu, ukuran, atau penggunaan…"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="chip-rail" aria-label="Filter kategori">
            <button
              className="chip"
              type="button"
              aria-pressed={category === ""}
              onClick={() => setCategory("")}
            >
              Semua
            </button>
            {categories.map((entry) => (
              <button
                className="chip"
                type="button"
                key={entry.id}
                aria-pressed={category === entry.id}
                onClick={() => setCategory(entry.id)}
              >
                {entry.name.replace("Batu ", "")}
              </button>
            ))}
          </div>

          <label className="sr-only" htmlFor="sizeSelect">
            Filter ukuran
          </label>
          <select
            className="size-select"
            id="sizeSelect"
            value={size}
            onChange={(event) => setSize(event.target.value)}
          >
            <option value="">Semua ukuran</option>
            {sizes.map((entry) => (
              <option value={entry} key={entry}>
                {entry}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-body">
        <div className="wrap">
          <div className="result-line">
            <p>
              <strong>{filtered.length}</strong> material ditampilkan
            </p>
            <p>Harga dan stok dikonfirmasi via WhatsApp.</p>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <SearchIcon />
              <h3>Belum ada material yang cocok.</h3>
              <p>
                Coba hapus kata kunci atau pilih kategori lain. Butuh ukuran
                khusus? Tanyakan langsung ke tim kami.
              </p>
              <button
                className="btn btn--outline btn--sm"
                type="button"
                onClick={resetFilters}
              >
                Tampilkan semua material
              </button>
            </div>
          ) : (
            <div className="catalog-groups">
              {grouped.map((group) => (
                <CategoryRail
                  key={group.category.id}
                  category={group.category}
                  items={group.items}
                  onOpen={openProduct}
                />
              ))}
            </div>
          )}

          <div className="catalog-foot">
            <div>
              <h3>Tidak menemukan ukuran yang Anda butuhkan?</h3>
              <p>
                Ukuran, motif, dan ketersediaan stok bisa dikonfirmasi langsung.
                Kirim ukuran area dan jenis pekerjaannya.
              </p>
            </div>
            <a
              className="btn btn--dark"
              href={whatsappLink(
                `Halo ${brandName}, saya ingin tanya ketersediaan ukuran batu alam.`,
                whatsapp,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tanya ketersediaan
              <ChevronRight className="ic ic--sm" />
            </a>
          </div>
        </div>
      </div>

      <dialog
        className="modal"
        ref={dialogRef}
        aria-labelledby="pdTitle"
        onClick={(event) => {
          if (event.target === dialogRef.current) closeProduct();
        }}
      >
        <button
          className="modal__close"
          type="button"
          onClick={closeProduct}
          aria-label="Tutup detail produk"
        >
          <CloseIcon />
        </button>

        {active ? (
          <div className="modal__grid">
            <div className="modal__media">
              <Image
                src={active.image}
                alt={active.alt}
                width={1200}
                height={800}
                sizes="(max-width: 900px) 92vw, 46vw"
              />
            </div>
            <div className="modal__body">
              <p className="modal__cat">{categoryName(active.categoryId)}</p>
              <h2 id="pdTitle">{active.name}</h2>
              <p className="modal__desc">{active.description}</p>

              <div className="modal__section">
                <span className="modal__label">Ukuran tersedia</span>
                <div className="tag-row">
                  {active.sizes.map((entry) => (
                    <span className="tag" key={entry.label}>
                      {entry.label}
                      {entry.satuan ? ` · ${entry.satuan}` : ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal__section">
                <span className="modal__label">Penggunaan</span>
                <div className="tag-row">
                  {active.use.map((entry) => (
                    <span className="tag" key={entry}>
                      {entry}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal__section">
                <span className="modal__label">Karakter</span>
                <p className="modal__desc">{active.character}</p>
              </div>

              {active.categoryId === "andesit" && comparisonSource ? (
                <div className="modal__section">
                  <span className="modal__label">Perbandingan varian andesit</span>
                  <table className="compare">
                    <thead>
                      <tr>
                        <th scope="col">Atribut</th>
                        {andesitItems.map((item) => (
                          <th scope="col" key={item.id}>
                            {item.name.includes("RTM") ? "RTM" : item.name.includes("RTA") ? "RTA" : item.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON_ROWS.map(([key, label]) => (
                        <tr key={key}>
                          <td>{label}</td>
                          {andesitItems.map((item) => (
                            <td key={item.id}>
                              {item.comparison?.[key] ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <div className="modal__cta">
                <a
                  className="btn btn--lime"
                  href={whatsappLink(
                    `Halo ${brandName}, saya ingin tanya ketersediaan ${active.name}${
                      active.sizes[0] ? ` ukuran ${active.sizes[0].label}` : ""
                    }. Apakah stoknya tersedia?`,
                    whatsapp,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya ketersediaan
                </a>
                <a className="btn btn--outline" href="/#kontak">
                  Konsultasi desain
                </a>
              </div>
              <p className="modal__note">
                Harga tidak ditampilkan di katalog. Penawaran dan ketersediaan
                ukuran dikonfirmasi lewat WhatsApp.
              </p>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
