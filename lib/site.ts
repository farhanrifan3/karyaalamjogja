export const site = {
  name: "Karya Alam",
  description:
    "Karya Alam: spesialis batu alam, kolam, tebing, taman, dan landscape di Sleman, Yogyakarta. Konsultasi desain, RAB, material, pemasangan, dan perawatan.",
  // Isi NEXT_PUBLIC_SITE_URL di production (lihat .env.example).
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  foundedYear: 1986,
  owner: "Farhan Rif’an",
  phone: {
    display: "081 328 696 300",
    e164: "+6281328696300",
    whatsapp: "6281328696300",
  },
  address: {
    street: "Jl. Kapten Haryadi, Dayakan, Sardonoharjo",
    district: "Kec. Ngaglik",
    city: "Kab. Sleman",
    region: "Daerah Istimewa Yogyakarta",
    country: "Indonesia",
    full: "Jl. Kapten Haryadi, Dayakan, Sardonoharjo, Kec. Ngaglik, Kab. Sleman, Yogyakarta.",
  },
  mapsUrl: "https://maps.app.goo.gl/xczdHgxKnueYhAxi9",
  socials: {
    instagram: "https://www.instagram.com/karyaalam_yogyakarta",
    facebook: "https://www.facebook.com/share/1CEob1ptzw/?mibextid=wwXIfr",
  },
  consultationMessage: "Halo Karya Alam, saya ingin konsultasi.",
  navigation: [
    { label: "Layanan", href: "#layanan" },
    { label: "Batu Alam", href: "#katalog" },
    { label: "Portofolio", href: "#galeri" },
    { label: "Proses", href: "#proses" },
    { label: "Kontak", href: "#kontak" },
  ],
} as const;
