import Image from "next/image";

import { SectionIntro } from "@/components/ui/SectionIntro";
import { stoneTypes } from "@/lib/stone-types";

export function StoneGuide() {
  return (
    <section>
      <div className="wrap">
        <SectionIntro
          eyebrow="Panduan memilih"
          title="RTA atau RTM?"
          lead="Sama-sama batu alam, tampilannya bisa beda jauh. Pilih sesuai gaya rumahmu."
        />

        <div className="vs">
          {stoneTypes.map((stone) => (
            <figure className="rv" key={stone.code}>
              <span className="pill">
                {stone.code} · {stone.label}
              </span>
              <div className="vs-media">
                <Image
                  src={stone.image}
                  alt={stone.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </div>
              <figcaption>
                <h3>{stone.title}</h3>
                <p>{stone.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
