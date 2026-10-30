import { Cta } from "@/components/ui/Cta";
import { Wordmark } from "@/components/ui/Wordmark";
import { chapters } from "@/lib/chapters";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

export function TitlePage() {
  return (
    <header id="top" className="titlepage ground--dark">
      <div className="titlepage__top">
        <Wordmark />
        <p className="titlepage__place">
          Ngaglik, Sleman
          <span>Sejak {site.foundedYear}</span>
        </p>
      </div>

      <div className="titlepage__main">
        <h1 className="sc-display titlepage__title">
          Batu, air, dan tanah.
        </h1>
        <p className="titlepage__lede">
          Kolam, tebing, taman, dan batu alam di Sleman. Digarap sejak 1986,
          dari desain dan RAB sampai perawatan.
        </p>
        <p className="titlepage__action">
          <Cta href={whatsappLink()} external>
            Konsultasi via WhatsApp
          </Cta>
          <span className="titlepage__phone">{site.phone.display}</span>
        </p>
      </div>

      <nav className="titlepage__index" aria-label="Isi halaman">
        <p className="sc-label">Isi</p>
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a href={`#${chapter.id}`}>
                <span className="titlepage__numeral">{chapter.numeral}</span>
                {chapter.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
