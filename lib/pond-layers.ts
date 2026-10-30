export type PondLayer = {
  layer: number;
  title: string;
  text: string;
};

export const pondLayers: readonly PondLayer[] = [
  {
    layer: 1,
    title: "Tanah dan galian",
    text: "Kedalaman dan bentuk ditentukan lebih dulu. Tanah dipadatkan supaya tidak turun setelah air masuk.",
  },
  {
    layer: 2,
    title: "Alas dan beton",
    text: "Pasir dan alas dipasang, lalu beton dituang sebagai dasar. Permukaannya dihaluskan sebelum dilapisi.",
  },
  {
    layer: 3,
    title: "Waterproofing",
    text: "Lapisan kedap air menutup beton dan sudut. Bagian ini yang menentukan kolam bertahan atau bocor lagi.",
  },
  {
    layer: 4,
    title: "Chamber dan pipa",
    text: "Bottom drain, pipa sirkulasi, dan chamber filter disusun sebelum dinding ditutup batu.",
  },
  {
    layer: 5,
    title: "Batu dan coping",
    text: "Dinding dilapisi batu alam, tepian ditutup coping agar rapi dan aman dipijak.",
  },
  {
    layer: 6,
    title: "Air, filter, dan koi",
    text: "Air diisi, filter dijalankan, dan kolam dibiarkan stabil sebelum koi dimasukkan.",
  },
];
