import type { Service } from "@/lib/types";

export const services: readonly Service[] = [
  {
    number: "01",
    title: "Kolam",
    description: "Koi, megatank, minimalis, dan kolam renang.",
    items: ["Filtrasi & chamber", "Perpipaan sirkulasi", "Perbaikan kebocoran"],
    image: "/images/svc-kolam.jpg",
    alt: "Koi di kolam taman",
  },
  {
    number: "02",
    title: "Tebing & Water Wall",
    description: "Tebing batu alam dan fitur air untuk taman maupun area komersial.",
    items: ["Air terjun", "Dinding air", "Peremajaan tebing"],
    image: "/images/svc-tebing.jpg",
    alt: "Tebing batu dengan air terjun bertingkat",
  },
  {
    number: "03",
    title: "Taman & Landscape",
    description: "Minimalis, tropis, taman kering, dan taman batu alam.",
    items: ["Taman depan & belakang", "Kantor & tempat usaha", "Renovasi taman lama"],
    image: "/images/taman-minimalis.jpg",
    alt: "Taman minimalis dengan batu alam",
  },
  {
    number: "04",
    title: "Lantai & Pemasangan",
    description: "Batu sikat, carport, dinding, pagar, dan fasad.",
    items: ["Pasang batu alam", "Coating", "Konsultasi material"],
    image: "/images/svc-lantai.jpg",
    alt: "Lantai batu alam di taman",
  },
  {
    number: "05",
    title: "Perawatan & Perbaikan",
    description: "Menjaga fungsi, ketahanan, dan keindahan kolam, taman, serta batu alam.",
    items: ["Menambal kebocoran kolam", "Renovasi taman", "Restorasi batu alam"],
    image: "/images/kolam-dinding-batu.jpg",
    alt: "Kolam dengan dinding batu alam",
  },
];
