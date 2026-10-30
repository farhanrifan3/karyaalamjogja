import type { Chapter } from "@/lib/chapters";

type ChapterHeadProps = {
  chapter: Chapter;
  heading: string;
  lead?: string;
  headingId?: string;
};

export function ChapterHead({
  chapter,
  heading,
  lead,
  headingId,
}: ChapterHeadProps) {
  return (
    <header className="chapter__head">
      <p className="chapter__folio">
        <span className="chapter__numeral">{chapter.numeral}</span>
        <span className="chapter__name">{chapter.title}</span>
      </p>
      <h2 className="sc-display chapter__title" id={headingId}>
        {heading}
      </h2>
      {lead ? <p className="chapter__lead">{lead}</p> : null}
    </header>
  );
}
