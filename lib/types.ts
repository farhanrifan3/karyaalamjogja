export type Service = {
  number: string;
  title: string;
  description: string;
  items: readonly string[];
};

export type Product = {
  name: string;
  description: string;
  use: string;
  character: string;
  image: string;
  alt: string;
};

export type StoneType = {
  code: string;
  label: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type GalleryItem = {
  image: string;
  alt: string;
  caption: string;
};

export type Review = {
  name: string;
  text: string;
  date: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type ContactLink = {
  icon: string;
  label: string;
  sublabel: string;
  href: string;
};
