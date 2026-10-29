import type { Service } from "@/lib/types";

export const services: readonly Service[] = [
  {
    number: "01",
    title: "Kolam",
    description: "Koi, megatank, minimalis, dan kolam renang.",
    items: ["Filtrasi & chamber", "Perpipaan sirkulasi", "Perbaikan kebocoran"],
  },
  {
    number: "02",
    title: "Tebing & Water Wall",
    description: "Tebing batu alam dan fitur air untuk taman maupun area komersial.",
    items: ["Air terjun", "Dinding air", "Peremajaan tebing"],
  },
  {
    number: "03",
    title: "Taman & Landscape",
    description: "Minimalis, tropis, taman kering, dan taman batu alam.",
    items: ["Taman depan & belakang", "Kantor & tempat usaha", "Renovasi taman lama"],
  },
  {
    number: "04",
    title: "Lantai & Pemasangan",
    description: "Batu sikat, carport, dinding, pagar, dan fasad.",
    items: ["Pasang batu alam", "Coating", "Konsultasi material"],
  },
  {
    number: "05",
    title: "Perawatan & Perbaikan",
    description: "Menjaga fungsi, ketahanan, dan keindahan kolam, taman, serta batu alam.",
    items: ["Menambal kebocoran kolam", "Renovasi taman", "Restorasi batu alam"],
  },
];
