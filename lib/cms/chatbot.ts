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

  // Extract dimensions (e.g. 10x12, 4x1.5, 4 x 4)
  const dimMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:x|×)\s*(\d+(?:\.\d+)?)/);
  const length = dimMatch ? parseFloat(dimMatch[1]) : null;
  const width = dimMatch ? parseFloat(dimMatch[2]) : null;

  // Deteksi Intent Layanan secara spesifik
  const isKolamRenang = text.includes("kolam renang");
  const isMegatank = text.includes("megatank") || text.includes("kaca");
  const isKolamKoi = text.includes("kolam koi") || (text.includes("kolam") && !text.includes("renang"));
  const isTaman = text.includes("taman") || text.includes("landscape") || text.includes("rumput");
  const isTebing = text.includes("tebing") || text.includes("water wall");
  const isPemasanganBatu = text.includes("pasang batu") || text.includes("fasad") || text.includes("carport") || text.includes("batu sikat");
  const isMaintenance = text.includes("maintenance") || text.includes("perawatan") || text.includes("bocor") || text.includes("coating");
  const isBudidaya = text.includes("budidaya") || text.includes("ras");

  // Jika minta kolam renang tapi belum ada ukuran
  if (isKolamRenang && (!length || !width)) {
    return {
      reply: "Baik, pembuatan Kolam Renang adalah salah satu layanan utama Karya Alam. Untuk menyusun estimasi RAB secara transparan, boleh tahu perkiraan ukuran panjang dan lebar kolam renang yang diinginkan (contoh: 10x5 meter) serta kedalamannya?",
    };
  }

  // Jika kolam renang dengan ukuran
  if (isKolamRenang && length && width) {
    const surface = length * width;
    const wallArea = 2 * (length + width) * 1.5; // 1.5m average depth
    const totalArea = surface + wallArea;

    const excavCost = Math.round(surface * 150000);
    const structCost = Math.round(totalArea * 1800000); // Kolam renang standar struktural Rp1.8jt/m2
    const pumpFilterCost = 8500000; // Pompa khusus kolam renang & sand filter
    const finishingCost = Math.round(surface * 600000); // Keramik / Mozaik / Batu sikat bibir
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
        disclaimer: "Estimasi awal kolam renang profesional Karya Alam. Harga final disesuaikan dengan sistem sirkulasi (skimmer/overflow) dan hasil survei.",
      },
    };
  }

  // Jika kolam koi megatank
  if (isMegatank && length && width) {
    const surface = length * width;
    const wallArea = 2 * (length + width) * 1.2;
    const totalArea = surface + wallArea;
    const constCost = Math.round(totalArea * 1200000); // Megatank 1.2jt/m2
    const glassCost = 6500000; // Kaca tempered samping
    const filterCost = 4500000;
    const pumpCost = 2500000;
    const total = constCost + glassCost + filterCost + pumpCost;

    return {
      reply: `Untuk Kolam Koi Megatank (dengan kaca samping) ukuran ${length}m × ${width}m, berikut rincian perkiraan RAB awal:`,
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
      reply: `Untuk pembuatan Taman berukuran ${length}m × ${width}m (luas ±${area} m²), berikut rincian perkiraan RAB awal:`,
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

  // Pertanyaan umum atau belum ada ukuran untuk kolam/taman
  if (isKolamRenang) {
    return {
      reply: "Baik, pembuatan Kolam Renang adalah salah satu dari 8 layanan utama kami. Berapa perkiraan ukuran panjang dan lebar kolam renang yang ingin Anda buat?",
    };
  }

  if (isKolamKoi || isMegatank) {
    return {
      reply: "Karya Alam menyediakan Kolam Koi Minimalis dan Kolam Koi Megatank (dengan kaca samping). Berapa ukuran panjang dan lebar kolam yang direncanakan?",
    };
  }

  if (isTaman) {
    return {
      reply: "Pembuatan Taman Landscape adalah keahlian kami sejak 1986. Berapa perkiraan ukuran panjang dan lebar lahan taman Anda?",
    };
  }

  if (isTebing) {
    return {
      reply: "Kami melayani pembuatan Tebing Batu Alam, Water Wall, dan Air Terjun buatan. Berapa ukuran tinggi dan panjang bidang tebing yang ingin dikerjakan?",
    };
  }

  if (isPemasanganBatu) {
    return {
      reply: "Kami melayani Jasa Pemasangan Batu Alam (Andesit, Candi, Palimanan, Templek) dan Carport Batu Sikat. Berapa estimasi luas area dinding/lantai yang akan dipasang?",
    };
  }

  if (isMaintenance) {
    return {
      reply: "Paket Maintenance Karya Alam mencakup perawatan mingguan & bulanan: pembersihan lumut, perbaikan kebocoran kolam, cat & coating ulang batu alam, hingga pembersihan filter. Layanan mana yang Anda butuhkan?",
    };
  }

  return {
    reply: "Karya Alam melayani 8 layanan utama: (1) Kolam Koi, (2) Kolam Renang, (3) Kolam Budidaya RAS, (4) Taman Landscape, (5) Tebing & Water Wall, (6) Pasang Batu Alam, (7) Penjualan Batu Alam, dan (8) Paket Maintenance. Proyek apa yang ingin Anda konsultasikan ukurannya?",
  };
}
