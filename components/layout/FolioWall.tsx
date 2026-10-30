"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Wordmark } from "@/components/ui/Wordmark";
import { chapters } from "@/lib/chapters";

const COURSE_H = 34;
const WALL_H = chapters.length * COURSE_H;
const STONE_H = 30;
const JOINT = 2;
const WIDTHS = [
  [16, 14, 12, 10],
  [11, 15, 14, 12],
  [14, 12, 16, 10],
  [12, 14, 10, 16],
];

function courses(index: number) {
  const widths = WIDTHS[index % WIDTHS.length];
  let x = 1;
  const total = widths.reduce((sum, width) => sum + width, 0) + JOINT * (widths.length - 1);

  return widths.map((width, stone) => {
    const left = x;
    x += width + JOINT;
    return {
      x: left,
      width,
      at: (left - 1) / total,
    };
  });
}

export function FolioWall() {
  const [current, setCurrent] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const wallRef = useRef<HTMLElement>(null);
  const barsRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const currentRef = useRef<number | null>(null);

  useEffect(() => {
    const rows = Array.from(
      wallRef.current?.querySelectorAll<SVGElement>("[data-course]") ?? [],
    );
    const bars = Array.from(barsRef.current?.children ?? []) as HTMLElement[];

    let frame = 0;

    function read() {
      frame = 0;
      const vh = window.innerHeight;
      const line = vh * 0.55;
      let active: number | null = null;

      chapters.forEach((chapter, index) => {
        const section = document.getElementById(chapter.id);
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const progress = Math.min(
          1,
          Math.max(0, (line - rect.top) / Math.max(rect.height, 1)),
        );

        rows[index]?.style.setProperty("--laid", progress.toFixed(4));
        bars[index]?.style.setProperty("--laid", progress.toFixed(4));

        if (rect.top <= line) active = index;
      });

      if (active !== currentRef.current) {
        currentRef.current = active;
        setCurrent(active);
        rows.forEach((row, index) => {
          if (index === active) {
            row.setAttribute("aria-current", "true");
            row.classList.add("is-current");
          } else {
            row.removeAttribute("aria-current");
            row.classList.remove("is-current");
          }
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

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const sheet = document.getElementById("daftar-bab");
      const focusable = sheet?.querySelectorAll<HTMLElement>("a[href], button");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      // `autoFocus` on the close button runs during commit, so the element that
      // opened the sheet has to be restored from its ref, not from activeElement.
      chipRef.current?.focus();
    };
  }, [open]);

  const active = current === null ? null : chapters[current];

  return (
    <>
      <nav className="folio-wall" aria-label="Bab halaman" ref={wallRef}>
        <a className="folio-wall__mark" href="#top" aria-label="Karya Alam, kembali ke atas">
          <Wordmark withText={false} />
        </a>

        <div className="folio-wall__wall">
          <svg viewBox={`0 0 60 ${WALL_H}`} className="wall">
            {chapters.map((chapter, index) => {
              const y = WALL_H - (index + 1) * COURSE_H + JOINT;
              return (
                <a
                  key={chapter.id}
                  href={`#${chapter.id}`}
                  className="course"
                  data-course={index}
                  aria-label={`Bab ${chapter.numeral}: ${chapter.title}`}
                >
                  <title>{`Bab ${chapter.numeral}: ${chapter.title}`}</title>
                  {courses(index).map((stone, stoneIndex) => (
                    <g key={stoneIndex}>
                      <rect
                        className="course__outline"
                        x={stone.x}
                        y={y}
                        width={stone.width}
                        height={STONE_H}
                        rx="1"
                      />
                      <rect
                        className="course__stone"
                        x={stone.x}
                        y={y}
                        width={stone.width}
                        height={STONE_H}
                        rx="1"
                        style={{ "--at": stone.at } as CSSProperties}
                      />
                    </g>
                  ))}
                </a>
              );
            })}
          </svg>
        </div>

        <div className="folio-wall__read" aria-hidden="true">
          <span className="folio-wall__numeral">{active ? active.numeral : "KA"}</span>
          <span className="folio-wall__title">{active ? active.title : "Karya Alam"}</span>
        </div>
      </nav>

      <button
        type="button"
        className="folio-chip"
        ref={chipRef}
        aria-expanded={open}
        aria-controls="daftar-bab"
        aria-label={
          active
            ? `Daftar bab — bab ${active.numeral}, ${active.title}`
            : "Daftar bab"
        }
        onClick={() => setOpen(true)}
      >
        <span className="folio-chip__numeral">{active ? active.numeral : "KA"}</span>
        <span className="folio-chip__title">
          {active ? active.title : "Karya Alam"}
        </span>
        <span className="folio-chip__bars" ref={barsRef} aria-hidden="true">
          {chapters.map((chapter) => (
            <span key={chapter.id} />
          ))}
        </span>
      </button>

      {open ? (
        <div className="contents" id="daftar-bab" role="dialog" aria-modal="true" aria-label="Isi halaman">
          <div className="contents__top">
            <Wordmark />
            <button
              type="button"
              className="contents__close"
              onClick={() => setOpen(false)}
              aria-label="Tutup daftar bab"
              autoFocus
            >
              Tutup
            </button>
          </div>

          <ol className="contents__list">
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={index === current ? "true" : undefined}
                >
                  <span>{chapter.numeral}</span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>

          <p className="contents__foot">
            Batu, air, dan tanah. Ngaglik, Sleman, sejak 1986.
          </p>
        </div>
      ) : null}
    </>
  );
}
