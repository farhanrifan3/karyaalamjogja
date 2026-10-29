import { ReviewsPanel } from "@/components/sections/ReviewsPanel";
import { contactLinks } from "@/lib/contact-links";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section id="kontak" className="contact">
      <div className="wrap">
        <div>
          <span className="eyebrow">Kontak</span>
          <h2 className="h2 rv">Yuk, konsultasi gratis lewat chat.</h2>
          <p>{site.address.full}</p>

          <div className="links">
            {contactLinks.map((link) => (
              <a
                key={link.sublabel}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="ic" aria-hidden="true">
                  {link.icon}
                </span>
                <span>
                  {link.label}
                  <small>{link.sublabel}</small>
                </span>
              </a>
            ))}
          </div>
        </div>

        <ReviewsPanel />
      </div>
    </section>
  );
}
