import type { StoneType } from "@/lib/types";

export const stoneTypes: readonly StoneType[] = [
  {
    code: "RTA",
    label: "Rata Alam",
    title: "Kasar, natural, berkarakter",
    description:
      "Permukaan sesuai belahan alami, bergelombang dengan bayangan dinamis. Cocok untuk fasad natural, pilar, pagar, dan taman. Perlu dibersihkan rutin dan dicoating.",
    image: "/images/andesit-rta.jpg",
    alt: "Batu andesit RTA",
  },
  {
    code: "RTM",
    label: "Rata Mesin",
    title: "Rata, rapi, modern",
    description:
      "Dipotong dan dihaluskan mesin, bentuk presisi, warna dan urat alami tetap ada. Mudah dipasang dan dibersihkan, cocok untuk interior maupun eksterior minimalis.",
    image: "/images/andesit-rtm.jpg",
    alt: "Batu andesit RTM halus",
  },
];
