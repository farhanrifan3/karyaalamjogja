export type Chapter = {
  id: string;
  numeral: string;
  title: string;
  nav: string;
};

export const chapters: readonly Chapter[] = [
  { id: "pangkalan", numeral: "I", title: "Pangkalan", nav: "Pangkalan" },
  { id: "layanan", numeral: "II", title: "Layanan", nav: "Layanan" },
  { id: "batu", numeral: "III", title: "Batu", nav: "Batu" },
  { id: "kolam", numeral: "IV", title: "Kolam", nav: "Kolam" },
  { id: "proyek", numeral: "V", title: "Proyek", nav: "Proyek" },
  { id: "proses", numeral: "VI", title: "Proses", nav: "Proses" },
  { id: "ulasan", numeral: "VII", title: "Ulasan", nav: "Ulasan" },
  { id: "kontak", numeral: "VIII", title: "Kontak", nav: "Kontak" },
];
