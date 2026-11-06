const SITE = {
  name: "Karya Alam",
  tagline: "dekorasi batu alam, kolam, dan taman",
  founded: 1986,
  whatsapp: "6281328696300",
  whatsappDisplay: "+62 813-2869-6300",
  address: "Jl. Kapten Haryadi, Dayakan, Sardonoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55581",
  addressShort: "Jl. Kapten Haryadi, Dayakan, Sardonoharjo — Sleman",
  hours: "Setiap hari, 07.00–17.00 WIB",
  maps: "https://www.google.com/maps/dir/?api=1&destination=-7.7244415,110.3923901"
};

const wa = (text) =>
  "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text);

const PROMOS = [
  {
    id: "promo-taman",
    label: "Promo",
    title: "Paket Taman Kering Compact",
    desc: "Zen garden siap pakai untuk sudut rumah: batu, tanaman, dan pemasangan dalam satu paket.",
    image: "assets/stock/project-zen.jpg",
    alt: "Sudut taman kering dengan tanaman pot dan batu dekoratif",
    normal: 5355000,
    promo: 4850000,
    unit: "/paket",
    until: "30 Nov 2026"
  },
  {
    id: "promo-andesit",
    label: "Terlaris",
    title: "Andesit Rata Alam 20×40",
    desc: "Permukaan belahan alami, tebal 2 cm. Untuk dinding, pagar, pilar, dan fasad.",
    image: "assets/stock/stone-andesit.jpg",
    alt: "Dinding batu andesit dengan tekstur alami",
    normal: 155000,
    promo: 139000,
    unit: "/m²",
    until: "15 Des 2026"
  },
  {
    id: "promo-maintenance",
    label: "Baru",
    title: "Maintenance Kolam Koi",
    desc: "Bersih lumut, cek filter dan chamber, coating ulang permukaan batu, plus laporan kondisi.",
    image: "assets/stock/service-maintenance.jpg",
    alt: "Petugas membersihkan permukaan batu di area kolam",
    normal: 160000,
    promo: 135000,
    unit: "/kunjungan",
    until: "31 Des 2026"
  }
];

const CATEGORIES = [
  {
    id: "andesit",
    name: "Batu Andesit",
    meta: "RTA & RTM · 7 ukuran",
    desc: "Batu vulkanik padat dengan karakter tegas. Tersedia rata alam dan rata mesin.",
    image: "assets/stock/stone-andesit.jpg",
    alt: "Tekstur dinding batu andesit abu-abu"
  },
  {
    id: "candi",
    name: "Batu Candi",
    meta: "Lempeng hitam pekat",
    desc: "Lempengan vulkanik gelap untuk kesan tenang, modern, dan kontras.",
    image: "assets/stock/stone-candi2.jpg",
    alt: "Dinding batu lava gelap dengan susunan rapi"
  },
  {
    id: "kali",
    name: "Batu Kali",
    meta: "Bulat sungai · per sak",
    desc: "Batu bulat alami aneka warna untuk taman, kolam, dan aksen tanah.",
    image: "assets/stock/stone-kali.jpg",
    alt: "Batu kali bulat di tepi air"
  },
  {
    id: "koral",
    name: "Koral",
    meta: "Halus–super kasar",
    desc: "Kerikil koral untuk carport sikat, taman kering, dan permukaan bertekstur.",
    image: "assets/stock/stone-koral.jpg",
    alt: "Kerikil koral berwarna terang"
  },
  {
    id: "palimanan",
    name: "Batu Palimanan",
    meta: "Krem berurat alami",
    desc: "Warna krem hangat dengan urat alami, cocok untuk interior dan kolam.",
    image: "assets/stock/stone-palimanan.jpg",
    alt: "Permukaan batu palimanan krem bertekstur"
  },
  {
    id: "templek",
    name: "Batu Tempel Acak",
    meta: "Lempeng pipih tak beraturan",
    desc: "Susunan lempeng acak untuk dinding taman, kolam, dan fasad berkarakter.",
    image: "assets/stock/stone-templek.jpg",
    alt: "Dinding batu lempeng gelap tersusun acak"
  }
];

const PRODUCTS = [
  {
    id: "andesit-rta",
    name: "Andesit Rata Alam (RTA)",
    category: "andesit",
    label: "Terlaris",
    desc: "Sisi depan dibiarkan sesuai belahan alami batu, tanpa diratakan mesin. Tekstur kasar dan bergelombang, dengan bayangan dinamis yang kuat.",
    character: "Kokoh, natural, berkarakter kuat. Cocok untuk fasad bergaya natural, pilar, pagar, dan taman.",
    uses: ["Fasad", "Pagar", "Pilar", "Dinding taman", "Lantai luar"],
    sizes: ["15×30 cm", "20×40 cm", "30×60 cm", "40×40 cm"],
    motif: "Alam / belahan",
    image: "assets/stock/stone-andesit.jpg",
    alt: "Dinding batu andesit rata alam dengan tekstur belahan"
  },
  {
    id: "andesit-rtm",
    name: "Andesit Rata Mesin (RTM)",
    category: "andesit",
    label: "",
    desc: "Permukaan dipotong dan dihaluskan dengan mesin. Rata, rapi, dan presisi, sementara warna dan urat alami batu tetap terlihat.",
    character: "Bersih, modern, minimalis. Lebih mudah dibersihkan dan dipasang karena bentuknya presisi.",
    uses: ["Dinding interior", "Dinding eksterior", "Lantai", "Kolam"],
    sizes: ["20×40 cm", "30×60 cm", "60×60 cm"],
    motif: "Polos / halus",
    image: "assets/stock/stone-andesit-rtm.jpg",
    alt: "Permukaan batu rata mesin dengan urat halus berwarna abu terang"
  },
  {
    id: "batu-candi",
    name: "Batu Candi",
    category: "candi",
    label: "",
    desc: "Lempeng batu vulkanik hitam pekat dari lereng Merapi. Warna gelapnya memberi kesan tenang dan modern pada dinding taman maupun fasad.",
    character: "Tenang, kontras, elegan. Permukaan berpori halus dengan warna hitam yang stabil.",
    uses: ["Dinding taman", "Fasad", "Pagar", "Kolam"],
    sizes: ["10×10 cm", "10×20 cm", "15×30 cm", "20×40 cm"],
    motif: "Polos",
    image: "assets/stock/stone-candi2.jpg",
    alt: "Susunan batu candi gelap pada dinding"
  },
  {
    id: "batu-kali",
    name: "Batu Kali",
    category: "kali",
    label: "",
    desc: "Batu bulat sungai aneka warna — abu, cokelat, dan krem. Banyak dipakai untuk taman, tepi kolam, dan pengisi area tanah.",
    character: "Alami, membulat, hangat. Memberi kesan taman yang tumbuh apa adanya.",
    uses: ["Taman", "Tepi kolam", "Aksen tanah", "Waterfall"],
    sizes: ["5–10 cm (sak)", "10–15 cm (sak)"],
    motif: "Bulat alami",
    image: "assets/stock/stone-kali.jpg",
    alt: "Batu kali bulat beraneka warna"
  },
  {
    id: "koral-putih",
    name: "Koral Putih",
    category: "koral",
    label: "",
    desc: "Koral putih untuk permukaan carport sikat, taman kering, dan jalur taman. Tersedia empat tingkat kehalusan.",
    character: "Bersih dan terang, dengan tekstur yang bisa disesuaikan kebutuhan.",
    uses: ["Carport sikat", "Taman kering", "Jalur taman", "Pot"],
    sizes: ["Halus 5–10 mm", "Sedang 10–15 mm", "Kasar 15–20 mm", "Super kasar 20–30 mm"],
    motif: "Curah",
    image: "assets/stock/stone-koral.jpg",
    alt: "Kerikil koral putih halus"
  },
  {
    id: "koral-hitam",
    name: "Koral Hitam",
    category: "koral",
    label: "Baru",
    desc: "Koral hitam untuk aksen kontras pada taman, jalur setapak, dan permukaan carport. Warna gelapnya menahan kesan kotor.",
    character: "Kontras, tenang, modern. Cocok dipadukan dengan batu candi dan tanaman hijau.",
    uses: ["Carport sikat", "Jalur taman", "Aksen taman"],
    sizes: ["Sedang 10–15 mm", "Kasar 15–20 mm"],
    motif: "Curah",
    image: "assets/stock/stone-candi.jpg",
    alt: "Kerikil batu gelap bertekstur halus"
  },
  {
    id: "palimanan",
    name: "Batu Palimanan",
    category: "palimanan",
    label: "",
    desc: "Batu pasir krem dengan urat alami. Warna hangatnya banyak dipakai untuk dinding interior, kolam, dan elemen dekoratif.",
    character: "Hangat, lembut, tropis. Mudah dibersihkan dan ramah untuk area basah.",
    uses: ["Interior", "Kolam", "Dinding dekoratif", "Pagar"],
    sizes: ["20×40 cm"],
    motif: "Urat alami",
    image: "assets/stock/stone-palimanan.jpg",
    alt: "Permukaan batu palimanan krem dengan urat alami"
  },
  {
    id: "templek",
    name: "Batu Tempel Acak",
    category: "templek",
    label: "",
    desc: "Lempeng pipih tak beraturan yang disusun acak. Memberi dimensi dan bayangan pada dinding taman, kolam, dan fasad.",
    character: "Ekspresif, berlapis, natural. Setiap bidang punya susunan yang tidak sama.",
    uses: ["Dinding taman", "Kolam", "Fasad", "Pilar"],
    sizes: ["Lembaran acak 10–30 cm"],
    motif: "Acak / susun",
    image: "assets/stock/stone-templek.jpg",
    alt: "Dinding batu tempel acak berwarna gelap"
  }
];

const COMPARISON = {
  intro: "Dua varian andesit yang paling sering dipilih. Perbedaannya ada pada proses akhir permukaan, bukan pada kualitas batu.",
  rows: [
    ["Proses", "Sisi depan dibiarkan sesuai belahan alami, tanpa diratakan mesin.", "Permukaan dipotong dan dihaluskan dengan mesin."],
    ["Permukaan", "Kasar, menonjol, bergelombang, bayangan dinamis.", "Rata, halus, rapi, seragam; warna dan urat alami tetap ada."],
    ["Kesan", "Kokoh, natural, berkarakter kuat.", "Bersih, modern, minimalis."],
    ["Perawatan", "Rutin dibersihkan dan coating khusus karena lebih berongga.", "Lebih mudah dibersihkan dan dipasang karena bentuk presisi."],
    ["Cocok untuk", "Fasad gaya natural, pilar, pagar, taman.", "Dinding interior maupun eksterior modern."]
  ]
};

const SERVICES = [
  {
    id: "kolam-koi",
    name: "Kolam Koi",
    image: "assets/stock/service-koi.jpg",
    alt: "Kolam koi dengan tanaman air dan bebatuan",
    meta: "Desain · Filtrasi · Waterfall",
    short: "Kolam koi lengkap dengan tebing, waterfall, filtrasi, dan jalur perpipaan yang benar.",
    coverage: [
      "Desain kolam dan tata letak sesuai ruang",
      "Tebing kolam koi dari batu alam",
      "Air terjun dan fitur air",
      "Sistem filtrasi dan chamber",
      "Jalur perpipaan sirkulasi",
      "Garansi konstruksi kedap air 100%"
    ]
  },
  {
    id: "kolam-renang",
    name: "Kolam Renang",
    image: "assets/stock/service-swim.jpg",
    alt: "Kolam renang dengan bangunan tropis di sekelilingnya",
    meta: "Konstruksi · Finishing batu",
    short: "Konstruksi kolam renang untuk hunian dan komersial, dengan finishing batu alam yang tahan lama.",
    coverage: [
      "Survei lokasi dan perencanaan",
      "Konstruksi kolam kedap air",
      "Finishing batu alam dan coping",
      "Sistem sirkulasi dan perpipaan",
      "Pembersihan akhir dan serah terima"
    ]
  },
  {
    id: "kolam-ras",
    name: "Kolam Budidaya (RAS)",
    image: "assets/stock/service-ras2.jpg",
    alt: "Hamparan kolam budidaya ikan dari udara",
    meta: "RAS · Modul kolam",
    short: "Kolam budidaya model RAS untuk skala usaha, dihitung dengan template BOQ tersendiri.",
    coverage: [
      "Perencanaan modul dan jumlah kolam",
      "Konstruksi kolam dan sekat",
      "Jalur perpipaan dan sirkulasi",
      "Ruang untuk filtrasi dan chamber",
      "RAB terpisah mengikuti template BOQ RAS"
    ]
  },
  {
    id: "taman",
    name: "Taman & Landscape",
    image: "assets/stock/service-taman.jpg",
    alt: "Taman tropis dengan dinding batu alam",
    meta: "Minimalis · Tropis · Batu alam",
    short: "Taman depan, belakang, kantor, dan tempat usaha dengan kombinasi batu, tanaman, dan elemen dekoratif.",
    coverage: [
      "Konsultasi konsep dan tata letak",
      "Olah tanah dan persiapan media",
      "Penanaman rumput dan tanaman",
      "Dinding taman dan aksen batu",
      "Penerangan dan elemen dekoratif"
    ]
  },
  {
    id: "tebing",
    name: "Tebing & Water Wall",
    image: "assets/stock/service-tebing.jpg",
    alt: "Dinding batu alam dengan tanaman di sela-selanya",
    meta: "Tebing taman · Dinding air",
    short: "Tebing batu alam, tebing taman, air terjun, dan water wall untuk fasad maupun area taman.",
    coverage: [
      "Tebing batu alam dan tebing taman",
      "Tebing air terjun",
      "Water wall / dinding air",
      "Perkuatan struktur dan drainase",
      "Finishing dan perawatan awal"
    ]
  },
  {
    id: "pasang",
    name: "Pasang Batu Alam",
    image: "assets/stock/service-pasang.jpg",
    alt: "Area duduk taman dengan lantai dan dinding batu",
    meta: "Dinding · Lantai · Carport",
    short: "Pemasangan batu untuk dekor halaman, dinding, pagar, fasad, lantai, carport batu sikat, dan koral taman.",
    coverage: [
      "Pengukuran dan persiapan bidang",
      "Pemasangan dinding dan fasad",
      "Lantai dan carport batu sikat",
      "Koral taman dan jalur setapak",
      "Perapian nat dan pembersihan akhir"
    ]
  },
  {
    id: "jual-batu",
    name: "Jual Batu Alam",
    image: "assets/stock/stone-palimanan.jpg",
    alt: "Permukaan batu alam untuk material dinding",
    meta: "Katalog · Konsultasi material",
    short: "Batu alam dari pangkalan sendiri, dengan konsultasi jenis, ukuran, dan kebutuhan material sesuai area.",
    coverage: [
      "Enam jenis batu pilihan",
      "Rekomendasi material sesuai lokasi",
      "Perhitungan kebutuhan dari ukuran area",
      "Pengiriman area Sleman–Yogyakarta",
      "Sampel dan konsultasi sebelum membeli"
    ]
  },
  {
    id: "maintenance",
    name: "Maintenance",
    image: "assets/stock/service-maintenance.jpg",
    alt: "Petugas membersihkan permukaan batu dengan mesin air",
    meta: "Mingguan · Bulanan",
    short: "Paket perawatan berkala untuk kolam, tebing, dan taman — termasuk coating ulang dan perbaikan kebocoran.",
    coverage: [
      "Bersih lumut dan permukaan batu",
      "Nambal kebocoran kolam koi dan renang",
      "Perbaikan bagian yang rusak",
      "Cat ulang, coating ulang, dan pelindung batu",
      "Bersih filter dan perawatan chamber",
      "Perbaikan perpipaan dan sirkulasi"
    ]
  }
];

const MAINTENANCE = {
  mingguan: [
    "Pembersihan lumut dan permukaan batu",
    "Pemeriksaan filter dan aliran air",
    "Cek kebocoran dan bagian rusak",
    "Laporan kondisi singkat"
  ],
  bulanan: [
    "Semua tugas paket mingguan",
    "Cat ulang dan coating ulang permukaan",
    "Perawatan chamber dan perpipaan",
    "Peremajaan tebing, fitur air, dan taman"
  ]
};

const REVIEWS = [
  {
    id: "r1",
    initial: "R.",
    name: "Rina",
    area: "Sleman",
    rating: 5,
    source: "website",
    service: "Kolam Koi",
    text: "RAB disusun rapi sebelum mulai, jadi tidak ada biaya yang tiba-tiba muncul. Progres tiap tahap dikabari lewat foto."
  },
  {
    id: "r2",
    initial: "H.",
    name: "Hendra",
    area: "Ngaglik",
    rating: 5,
    source: "website",
    service: "Taman & Landscape",
    text: "Taman kecil di belakang rumah jadi lebih hidup. Tim mau mendengar dulu maunya kami, bukan langsung menawarkan paket mahal."
  },
  {
    id: "r3",
    initial: "D.",
    name: "Dimas",
    area: "Yogyakarta",
    rating: 4,
    source: "website",
    service: "Pasang Batu Alam",
    text: "Pemasangan dinding batu rapi dan nat konsisten. Waktu pengerjaan mundur sedikit karena hujan, tapi komunikasinya jelas."
  }
];

const GOOGLE_REVIEWS = [
  {
    id: "g1",
    initial: "S.",
    name: "Sari",
    rating: 5,
    text: "Hasil kolam koi sesuai gambar desain. Tebing batunya kuat dan tidak ada rembes setelah musim hujan.",
    when: "2 minggu lalu"
  },
  {
    id: "g2",
    initial: "A.",
    name: "Agus",
    rating: 5,
    text: "Beli andesit untuk pagar, ukurannya presisi dan pengiriman tepat waktu.",
    when: "1 bulan lalu"
  }
];

const ESTIMATOR = {
  koi: { name: "Kolam Koi", build: 900000, filtration: 4500000 },
  renang: { name: "Kolam Renang", perM3: 4500000 },
  taman: { name: "Taman", perM2: 290000 },
  tebing: { name: "Tebing", low: 350000, high: 400000, threshold: 20 },
  pasang: { name: "Pasang Batu Alam", perM2: 250000 },
  maintenance: { name: "Maintenance Kolam", perVisit: 160000, visits: 4 }
};

function rupiah(value) {
  return "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(value));
}
