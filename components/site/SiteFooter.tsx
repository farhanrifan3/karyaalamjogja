import Link from "next/link";

import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href="/" aria-label="Karya Alam — beranda">
              <span className="brand__mark" aria-hidden="true">
                KA
              </span>
              <span>
                <span className="brand__name">Karya Alam</span>
                <span className="brand__tag">batu alam · kolam · taman</span>
              </span>
            </Link>
            <p className="foot-about">
              Pangkalan batu alam, kolam, tebing, dan taman di Jl. Kapten
              Haryadi, Sardonoharjo, Ngaglik, Sleman. Melayani Yogyakarta dan
              sekitarnya sejak {site.foundedYear}.
            </p>
          </div>

          <div>
            <span className="foot-title">Jelajahi</span>
            <ul className="foot-list">
              <li>
                <Link href="/#profil">Profil</Link>
              </li>
              <li>
                <Link href="/katalog">Katalog batu</Link>
              </li>
              <li>
                <Link href="/#layanan">Layanan</Link>
              </li>
              <li>
                <Link href="/#testimoni">Testimoni</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="foot-title">Layanan</span>
            <ul className="foot-list">
              <li>
                <Link href="/#layanan">Kolam Koi</Link>
              </li>
              <li>
                <Link href="/#layanan">Kolam Renang</Link>
              </li>
              <li>
                <Link href="/#layanan">Taman &amp; Landscape</Link>
              </li>
              <li>
                <Link href="/#layanan">Tebing &amp; Water Wall</Link>
              </li>
              <li>
                <Link href="/#layanan">Maintenance</Link>
              </li>
            </ul>
          </div>

          <div>
            <span className="foot-title">Kontak</span>
            <ul className="foot-list">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  {site.phone.e164}
                </a>
              </li>
              <li>
                <span>
                  Jl. Kapten Haryadi, Dayakan,
                  <br />
                  Sardonoharjo, Sleman 55581
                </span>
              </li>
              <li>
                <span>{site.hours}</span>
              </li>
              <li>
                <a
                  href={site.mapsDirectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Petunjuk arah ke pangkalan
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>
            © {year} {site.name}. Seluruh hak cipta dilindungi.
          </span>
          <span>Harga promo berlaku selama periode tayang.</span>
        </div>
      </div>
    </footer>
  );
}
