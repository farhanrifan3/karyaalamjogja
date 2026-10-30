import { ChapterHead } from "@/components/ui/ChapterHead";
import { Wordmark } from "@/components/ui/Wordmark";
import { chapters } from "@/lib/chapters";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

const chapter = chapters[7];

export function Colophon() {
  return (
    <section
      id={chapter.id}
      className="chapter chapter--kontak ground--dark"
      data-sc-act="flow"
      aria-labelledby="kontak-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="kontak-title"
          heading="Mari mulai dari lokasi Anda."
          lead="Kirim foto lahan, ukuran kasar, dan gambaran yang Anda inginkan. Kami balas dengan langkah berikutnya."
        />

        <div className="contact">
          <a
            className="contact__primary"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sc-label">WhatsApp</span>
            <span className="contact__number">{site.phone.display}</span>
            <span className="contact__action">
              Konsultasi via WhatsApp
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 8h11M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </a>

          <div className="contact__list">
            <div className="contact__row">
              <span className="sc-label">Pangkalan</span>
              <p>{site.address.full}</p>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                Buka di Google Maps
              </a>
            </div>

            <div className="contact__row">
              <span className="sc-label">Instagram</span>
              <a
                href={site.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                @karyaalam_yogyakarta
              </a>
            </div>

            <div className="contact__row">
              <span className="sc-label">Facebook</span>
              <a
                href={site.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Karya Alam
              </a>
            </div>

            <div className="contact__row">
              <span className="sc-label">Pemilik</span>
              <p>{site.owner}</p>
            </div>
          </div>
        </div>

        <footer className="masthead">
          <hr className="sc-rule" />
          <div className="masthead__grid">
            <div>
              <Wordmark />
              <p className="masthead__line">
                Batu alam, kolam, tebing, taman, dan landscape. Ngaglik, Sleman,
                sejak {site.foundedYear}.
              </p>
            </div>
            <div>
              <p className="sc-label">Alamat</p>
              <p className="masthead__line">{site.address.full}</p>
            </div>
            <div>
              <p className="sc-label">Telepon</p>
              <a className="masthead__line" href={`tel:${site.phone.e164}`}>
                {site.phone.display}
              </a>
            </div>
          </div>

          <p className="masthead__copyright">
            © {new Date().getFullYear()} {site.name}. Semua foto pekerjaan
            Karya Alam.
          </p>
        </footer>
      </div>
    </section>
  );
}
