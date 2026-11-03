export type ChatMessage = {
  sender: "user" | "bot";
  text: string;
  rab?: {
    title: string;
    categories: Array<{ name: string; cost: number; detail: string }>;
    total: number;
    disclaimer: string;
  };
};

export async function processChatConversation(
  history: Array<{ sender: "user" | "bot"; text: string }>,
  latestInput: string
): Promise<{ reply: string; rab?: any }> {
  const text = latestInput.toLowerCase();

  // Ekstraksi ukuran dengan titik atau koma (misal: 1.5x2, 1,5 x 2, 4x4)
  const dimMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:x|×)\s*(\d+(?:[.,]\d+)?)/);
  const length = dimMatch ? parseFloat(dimMatch[1].replace(",", ".")) : null;
  const width = dimMatch ? parseFloat(dimMatch[2].replace(",", ".")) : null;

  // Deteksi Intent Layanan secara spesifik
  const isKolamRenang = text.includes("kolam renang");
  const isMegatank = text.includes("megatank") || text.includes("kaca");
  const isKolamKoi = text.includes("kolam koi") || (text.includes("kolam") && !text.includes("renang"));
  const isTaman = text.includes("taman") || text.includes("landscape") || text.includes("rumput");
  const isTebing = text.includes("tebing") || text.includes("water wall");
  const isPemasanganBatu = text.includes("pasang batu") || text.includes("fasad") || text.includes("carport") || text.includes("batu sikat");
  const isMaintenance = text.includes("maintenance") || text.includes("perawatan") || text.includes("bocor") || text.includes("coating");

  // Chat pertama atau sapaan / belum ada ukuran untuk kolam/taman
  const isFirstOrHelp = history.length <= 1 || text.includes("bantu") || text.includes("cara") || text.includes("pilih");

  if (isFirstOrHelp && (!length || !width)) {
    return {
      reply: "Halo! Silakan tuliskan ukuran proyek dan jenis layanan yang ingin dihitung. Contoh format:\n👉 \"taman 1.5x6 dengan tambahan tanaman bonsai\"\n👉 \"kolam koi 4x3\"\n👉 \"kolam renang 10x5\"",
    };
  }

  // Jika minta kolam renang tapi belum ada ukuran
  if (isKolamRenang && (!length || !width)) {
    return {
      reply: "Baik, pembuatan Kolam Renang adalah salah satu layanan utama Karya Alam. Mohon tulis ukuran panjang dan lebar (contoh: 10x5 atau 4,5x3).",
    };
  }

  // Jika kolam renang dengan ukuran
  if (isKolamRenang && length && width) {
    const surface = length * width;
    const wallArea = 2 * (length + width) * 1.5;
    const totalArea = surface + wallArea;

    const excavCost = Math.round(surface * 150000);
    const structCost = Math.round(totalArea * 1800000);
    const pumpFilterCost = 8500000;
    const finishingCost = Math.round(surface * 600000);
    const designCost = 750000;
    const total = excavCost + structCost + pumpFilterCost + finishingCost + designCost;

    return {
      reply: `Terima kasih! Untuk pembuatan Kolam Renang berukuran ${length}m × ${width}m (luas ±${totalArea.toFixed(1)} m² area kerja), berikut rincian perkiraan RAB awal per kategori:`,
      rab: {
        title: `Estimasi RAB Kolam Renang ${length}m × ${width}m`,
        categories: [
          { name: "I. Galian & Tanah", cost: excavCost, detail: "Pekerjaan galian dan pembuangan tanah" },
          { name: "II. Struktur & Waterproofing", cost: structCost, detail: "Beton bertulang struktur kedap air kolam renang" },
          { name: "III. Pompa & Sand Filter", cost: pumpFilterCost, detail: "Pompa sirkulasi khusus kolam renang & tabung filter" },
          { name: "IV. Finishing Mozaik / Batu", cost: finishingCost, detail: "Pemasangan keramik/mozaik dan bibir kolam" },
          { name: "V. Desain & RAB", cost: designCost, detail: "Gambar teknik & perencanaan" },
        ],
        total,
        disclaimer: "Estimasi awal kolam renang profesional Karya Alam. Harga final disesuaikan dengan hasil survei.",
      },
    };
  }

  // Jika kolam koi megatank
  if (isMegatank && length && width) {
    const surface = length * width;
    const wallArea = 2 * (length + width) * 1.2;
    const totalArea = surface + wallArea;
    const constCost = Math.round(totalArea * 1200000);
    const glassCost = 6500000;
    const filterCost = 4500000;
    const pumpCost = 2500000;
    const total = constCost + glassCost + filterCost + pumpCost;

    return {
      reply: `Untuk Kolam Koi Megatank ukuran ${length}m × ${width}m, berikut rincian perkiraan RAB awal:`,
      rab: {
        title: `Estimasi RAB Kolam Koi Megatank ${length}m × ${width}m`,
        categories: [
          { name: "I. Struktur Beton Megatank", cost: constCost, detail: "Konstruksi khusus kaca tebal" },
          { name: "II. Kaca Tempered Samping", cost: glassCost, detail: "Kaca tebal khusus akuarium/kolam" },
          { name: "III. Sistem Filtrasi & Chamber", cost: filterCost, detail: "Chamber kapasitas besar" },
          { name: "IV. Pompa & Sirkulasi", cost: pumpCost, detail: "Pompa celup & aerator" },
        ],
        total,
        disclaimer: "Estimasi awal megatank Karya Alam. Spesifikasi ketebalan kaca disesuaikan dengan kedalaman air.",
      },
    };
  }

  // Jika kolam koi minimalis standar
  if (isKolamKoi && length && width) {
    const surface = length * width;
    const wallArea = 2 * (length + width) * 1.2;
    const totalArea = surface + wallArea;
    const constCost = Math.round(totalArea * 900000);
    const filterCost = 3500000;
    const pumpCost = 2000000;
    const stoneCost = Math.round(surface * 250000);
    const total = constCost + filterCost + pumpCost + stoneCost;

    return {
      reply: `Untuk Kolam Koi Minimalis ukuran ${length}m × ${width}m, berikut rincian perkiraan RAB awal:`,
      rab: {
        title: `Estimasi RAB Kolam Koi Minimalis ${length}m × ${width}m`,
        categories: [
          { name: "I. Konstruksi & Waterproofing", cost: constCost, detail: "Struktur kolam kedap air" },
          { name: "II. Sistem Filtrasi Chamber", cost: filterCost, detail: "Media filter lengkap" },
          { name: "III. Pompa & Sirkulasi", cost: pumpCost, detail: "Pompa & aerator" },
          { name: "IV. Finishing Batu Alam", cost: stoneCost, detail: "Batu alam tebing / dinding" },
        ],
        total,
        disclaimer: "Estimasi awal kolam koi minimalis. Termasuk garansi bocor 1 tahun.",
      },
    };
  }

  // Jika taman
  if (isTaman && length && width) {
    const area = length * width;
    const landPrep = Math.round(area * 50000);
    const grassCost = Math.round(area * 75000);
    const plantCost = Math.round(area * 150000);
    const stoneDecor = Math.round(area * 100000);
    const total = landPrep + grassCost + plantCost + stoneDecor;

    return {
      reply: `Untuk pembuatan Taman berukuran ${length}m × ${width}m (luas ±${area.toFixed(1)} m²), berikut rincian perkiraan RAB awal:`,
      rab: {
        title: `Estimasi RAB Pembuatan Taman ${length}m × ${width}m`,
        categories: [
          { name: "I. Olah Tanah & Galian", cost: landPrep, detail: "Pembersihan & gembur tanah" },
          { name: "II. Rumput (Gajah Mini / Jepang)", cost: grassCost, detail: "Pemasangan rumput hijau" },
          { name: "III. Tanaman Hias & Pohon", cost: plantCost, detail: "Aneka semak & tanaman hias" },
          { name: "IV. Batu Hias & Koral", cost: stoneDecor, detail: "Koral putih/hitam" },
        ],
        total,
        disclaimer: "Estimasi awal taman landscape Karya Alam.",
      },
    };
  }

  // Jika ada ukuran angka tapi belum jelas layanan
  if (length && width) {
    const area = length * width;
    const estCost = Math.round(area * 350000);
    return {
      reply: `Untuk ukuran ${length}m × ${width}m (luas ±${area.toFixed(1)} m²), apakah proyek yang dimaksud adalah pembuatan Taman, Kolam Koi, atau Pasang Batu Alam? Mohon sebutkan jenis layanannya.`,
    };
  }

  return {
    reply: "Karya Alam melayani 8 layanan utama: (1) Kolam Koi, (2) Kolam Renang, (3) Kolam Budidaya RAS, (4) Taman Landscape, (5) Tebing & Water Wall, (6) Pasang Batu Alam, (7) Penjualan Batu Alam, dan (8) Paket Maintenance.\n\nContoh format penulisan:\n👉 \"taman 1,5x6\"\n👉 \"kolam koi 4x3\"\nProyek apa yang ingin Anda konsultasikan?",
  };
}
