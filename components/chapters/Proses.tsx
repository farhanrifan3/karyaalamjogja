import { ChapterHead } from "@/components/ui/ChapterHead";
import { chapters } from "@/lib/chapters";
import { processSteps } from "@/lib/process-steps";

const chapter = chapters[5];

export function Proses() {
  return (
    <section
      id={chapter.id}
      className="chapter chapter--proses ground--dark"
      data-sc-act="flow"
      aria-labelledby="proses-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="proses-title"
          heading="Empat langkah, tanpa kejutan di tengah."
          lead="RAB dan lingkup kerja disusun sebelum material dipesan. Selama pengerjaan, progres dikabari."
        />

        <ol className="steps">
          {processSteps.map((step, index) => (
            <li className="step" key={step.title} data-sc-in>
              <p className="step__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="sc-display step__title">
                <span className="sr-only">Langkah {index + 1}: </span>
                {step.title}
              </h3>
              <p className="step__text">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
