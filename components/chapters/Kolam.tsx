"use client";

import { useEffect, useRef, useState } from "react";

import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { chapters } from "@/lib/chapters";
import { pondLayers } from "@/lib/pond-layers";
import { whatsappLink } from "@/lib/whatsapp";

const chapter = chapters[3];

const WALL_COURSES = Array.from({ length: 8 }, (_, index) => index);
const FLOOR_STONES = Array.from({ length: 6 }, (_, index) => index);

function PondDrawing() {
  return (
    <svg
      className="pond__drawing"
      viewBox="0 0 640 430"
      role="img"
      aria-label="Potongan kolam koi: tanah, alas beton, waterproofing, chamber filter, dinding batu, air, dan koi"
    >
      <defs>
        <pattern id="pond-earth" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="12" className="plate__hatch" />
        </pattern>
        <clipPath id="pond-water-clip">
          <path d="M100 130 V306 H400 V130 Z" />
        </clipPath>
      </defs>

      <rect x="0" y="128" width="640" height="302" className="plate__earth" />
      <rect x="0" y="128" width="640" height="302" fill="url(#pond-earth)" />
      <line x1="0" y1="128" x2="640" y2="128" className="plate__ground" />

      <g className="layer lay-1" data-plate-layer="1">
        <rect x="70" y="128" width="360" height="220" className="pl-stroke pl-dash" />
        <text x="56" y="342" className="plate__num">1</text>
      </g>

      <g className="layer lay-2" data-plate-layer="2">
        <rect x="70" y="318" width="360" height="20" className="pl-fill pl-stroke" />
        <rect x="70" y="338" width="360" height="10" className="pl-fill pl-stroke pl-sand" />
        <text x="56" y="320" className="plate__num">2</text>
      </g>

      <g className="layer lay-5" data-plate-layer="5">
        {WALL_COURSES.map((course) => {
          const y = 130 + course * 22;
          return (
            <g key={course}>
              <rect x="70" y={y} width="30" height="21" className="pl-stone" />
              <rect x="400" y={y} width="30" height="21" className="pl-stone" />
            </g>
          );
        })}
        {FLOOR_STONES.map((stone) => (
          <rect
            key={stone}
            x={100 + stone * 50}
            y="306"
            width="49"
            height="12"
            className="pl-stone"
          />
        ))}
        <rect x="54" y="110" width="48" height="18" className="pl-stone" />
        <rect x="398" y="110" width="48" height="18" className="pl-stone" />
        <line x1="78" y1="110" x2="78" y2="128" className="plate__joint" />
        <line x1="422" y1="110" x2="422" y2="128" className="plate__joint" />
        <text x="56" y="120" className="plate__num">5</text>
      </g>

      <g className="layer lay-3" data-plate-layer="3">
        <path d="M100 130 V306 H400 V130" className="pl-membrane" />
        <text x="56" y="240" className="plate__num">3</text>
      </g>

      <g className="layer lay-4" data-plate-layer="4">
        <rect x="480" y="176" width="120" height="172" className="pl-fill pl-stroke" />
        <rect x="474" y="168" width="132" height="8" className="pl-fill pl-stroke" />
        <line x1="520" y1="176" x2="520" y2="348" className="pl-stroke" />
        <line x1="560" y1="176" x2="560" y2="348" className="pl-stroke" />
        <circle cx="500" cy="214" r="2" className="pl-dot" />
        <circle cx="500" cy="232" r="2" className="pl-dot" />
        <circle cx="500" cy="250" r="2" className="pl-dot" />
        <line x1="532" y1="214" x2="548" y2="232" className="pl-stroke" />
        <line x1="532" y1="232" x2="548" y2="250" className="pl-stroke" />
        <line x1="532" y1="250" x2="548" y2="268" className="pl-stroke" />
        <circle cx="572" cy="214" r="2.5" className="pl-dot" />
        <circle cx="588" cy="228" r="2.5" className="pl-dot" />
        <circle cx="574" cy="242" r="2.5" className="pl-dot" />
        <circle cx="590" cy="258" r="2.5" className="pl-dot" />
        <circle cx="582" cy="320" r="9" className="pl-stroke" />
        <path d="M576 326 L588 314 M576 314 L588 326" className="pl-stroke" />
        <path d="M250 318 V356 H474 V330" className="pl-pipe" />
        <rect x="238" y="310" width="24" height="7" className="pl-fill pl-stroke" />
        <path d="M598 330 V150 H436 V178" className="pl-pipe" />
        <path d="M436 178 V198" className="pl-fall" />
        <path d="M428 200 Q432 195 436 200 Q440 195 444 200" className="pl-fall" />
        <text x="466" y="162" className="plate__num">4</text>
      </g>

      <g className="layer lay-6" data-plate-layer="6">
        <g clipPath="url(#pond-water-clip)">
          <g className="plate__water-move">
            <rect x="100" y="180" width="300" height="300" className="plate__water" />
            <line x1="100" y1="180" x2="400" y2="180" className="plate__waterline" />
          </g>
        </g>
        <g className="plate__koi">
          <g transform="translate(168 248)">
            <path d="M0 0 Q14 -9 30 0 Q14 9 0 0 Z" />
            <path d="M0 0 L-9 -6 L-9 6 Z" />
          </g>
          <g transform="translate(286 270) scale(0.8)">
            <path d="M0 0 Q14 -9 30 0 Q14 9 0 0 Z" />
            <path d="M0 0 L-9 -6 L-9 6 Z" />
          </g>
        </g>
        <text x="108" y="202" className="plate__num">6</text>
      </g>
    </svg>
  );
}

export function Kolam() {
  const [active, setActive] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(1);

  useEffect(() => {
    const plate = plateRef.current;
    const notes = notesRef.current;
    const section = sectionRef.current;
    if (!plate || !notes || !section) return;

    const noteEls = Array.from(
      notes.querySelectorAll<HTMLElement>("[data-layer-note]"),
    );
    const layers = Array.from(
      plate.querySelectorAll<SVGGElement>("[data-plate-layer]"),
    );

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      plate.style.setProperty("--fill", "1");
      layers.forEach((layer) => layer.classList.add("is-lit", "is-active"));
      noteEls.forEach((note) => note.classList.add("is-read"));
      setActive(6);
      activeRef.current = 6;
      return;
    }

    let frame = 0;

    function read() {
      frame = 0;
      const vh = window.innerHeight;
      const rect = notes!.getBoundingClientRect();
      const fill = Math.min(
        1,
        Math.max(0, (vh * 0.72 - rect.top) / Math.max(rect.height, 1)),
      );

      plate!.style.setProperty("--fill", fill.toFixed(4));

      let next = 1;
      noteEls.forEach((note, index) => {
        const box = note.getBoundingClientRect();
        if (box.top < vh * 0.62) next = index + 1;
        note.classList.toggle("is-read", box.top < vh * 0.5);
      });

      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
        layers.forEach((layer) => {
          const layerNumber = Number(layer.getAttribute("data-plate-layer"));
          layer.classList.toggle("is-active", layerNumber === next);
          layer.classList.toggle("is-lit", layerNumber <= next);
        });
      }
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(read);
    }

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      id={chapter.id}
      className="chapter chapter--kolam ground--dark"
      data-sc-act="flow"
      aria-labelledby="kolam-title"
      ref={sectionRef}
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="kolam-title"
          heading="Satu kolam, enam lapis."
          lead="Kolam yang bertahan dimulai dari bawah, bukan dari batu di permukaannya. Ini urutan yang kami kerjakan."
        />

        <div className="pond__grid">
          <div className="pond__plate" ref={plateRef}>
            <p className="pond__readout sc-label">
              Lapis <span>{String(active).padStart(2, "0")}</span>
            </p>
            <PondDrawing />
            <p className="pond__caption">
              Potongan kolam koi. Gambar skematik, bukan skala.
            </p>
          </div>

          <div className="pond__notes" ref={notesRef}>
            {pondLayers.map((layer) => (
              <article
                className="pond-note"
                data-layer-note
                key={layer.layer}
                id={`lapis-${layer.layer}`}
              >
                <p className="pond-note__num sc-label">Lapis {layer.layer}</p>
                <h3 className="sc-display pond-note__title">{layer.title}</h3>
                <p className="pond-note__text">{layer.text}</p>
              </article>
            ))}

            <div className="pond__outro">
              <p>
                Kolam lama bocor atau airnya keruh? Kami cek penyebabnya dulu
                sebelum menawarkan perbaikan.
              </p>
              <Cta href={whatsappLink()} external>
                Konsultasi via WhatsApp
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
