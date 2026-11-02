import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { chapters } from "@/lib/chapters";
import { getApprovedReviews } from "@/lib/cms/reviews";
import { site } from "@/lib/site";

const chapter = chapters[6];

export async function Ulasan() {
  const approvedReviews = await getApprovedReviews();

  return (
    <section
      id={chapter.id}
      className="chapter chapter--ulasan ground--light"
      data-sc-act="flow"
      aria-labelledby="ulasan-title"
    >
      <div className="chapter__inner">
        <ChapterHead
          chapter={chapter}
          headingId="ulasan-title"
          heading="Kata yang datang setelah serah terima."
          lead="Pengalaman nyata dari klien kami. Ulasan bersumber dari situs resmi dan Google Maps."
        />

        <div className="quotes">
          {approvedReviews.map((review, index) => (
            <blockquote className="quote" key={review.id} data-sc-in>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span className="quote__num" aria-hidden="true" style={{ position: "static" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.72rem", padding: "0.2rem 0.6rem", borderRadius: "20px", background: review.source === "google" ? "rgba(66, 133, 244, 0.1)" : "rgba(47, 91, 56, 0.1)", color: review.source === "google" ? "#1a73e8" : "var(--a-accent)", fontWeight: 600, textTransform: "uppercase" }}>
                  {review.source === "google" ? "Google Maps" : "Website Resmi"}
                </span>
              </div>
              <p>{review.text}</p>
              <footer>
                <cite>{review.name}</cite>
                <span>{review.date}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="ulasan__actions" data-sc-in style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <Cta href={site.mapsUrl} external>
            Tulis ulasan di Google Maps
          </Cta>

          <details className="review-write">
            <summary>Tulis ulasan Anda di sini</summary>
            <ReviewForm />
          </details>
        </div>
      </div>
    </section>
  );
}
