import { SectionIntro } from "@/components/ui/SectionIntro";
import { processSteps } from "@/lib/process-steps";

export function Process() {
  return (
    <section id="proses">
      <div className="wrap">
        <SectionIntro eyebrow="Cara kerja" title="Jelas dari awal." />

        <div className="steps">
          {processSteps.map((step) => (
            <article className="step rv" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
