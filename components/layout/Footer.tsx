import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer>
      © {new Date().getFullYear()} {site.name} · Batu Alam, Kolam, Tebing, Taman &
      Landscape Yogyakarta
    </footer>
  );
}
