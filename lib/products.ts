import type { Product } from "@/lib/types";

export const products: readonly Product[] = [
  {
    name: "Batu Andesit",
    description: "Keras, gelap, dan tenang. Banyak dipakai untuk bidang yang lebar.",
    use: "Dinding, lantai, fasad",
    character: "Keras, gelap, tahan lama",
    image: "/images/batu-andesit.jpg",
    alt: "Batu andesit",
  },
  {
    name: "Batu Palimanan",
    description: "Warna krem dengan garis alami yang tidak pernah sama.",
    use: "Dinding, tiang, pagar",
    character: "Krem, bergaris, hangat",
    image: "/images/batu-palimanan.jpg",
    alt: "Batu palimanan",
  },
  {
    name: "Batu Candi",
    description: "Hitam pekat dengan pori halus. Tegas tanpa banyak bayangan.",
    use: "Dinding luar, pagar",
    character: "Hitam pekat, berpori",
    image: "/images/batu-candi.jpg",
    alt: "Batu candi",
  },
  {
    name: "Batu Lempengan",
    description: "Pecahan lempeng dengan motif acak, disusun seperti peta.",
    use: "Dinding, tebing",
    character: "Motif acak, tipis",
    image: "/images/batu-lempengan.jpg",
    alt: "Batu lempengan",
  },
  {
    name: "Koral & Batu Sikat",
    description: "Permukaan kasar yang tidak licin saat hujan.",
    use: "Carport, halaman, jalur taman",
    character: "Kasar, tidak licin",
    image: "/images/koral-batu-sikat.jpg",
    alt: "Batu koral dan batu sikat",
  },
  {
    name: "Batu Kali & Sungai",
    description: "Bulat karena air, dipakai sebagai aksen yang tidak dibuat-buat.",
    use: "Taman, kolam, tebing air",
    character: "Bulat, alami",
    image: "/images/batu-kali.jpg",
    alt: "Batu kali",
  },
];
