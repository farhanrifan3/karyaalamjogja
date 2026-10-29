type SectionIntroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
};

export function SectionIntro({ eyebrow, title, lead }: SectionIntroProps) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h2 rv">{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </>
  );
}
