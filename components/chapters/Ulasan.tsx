import { ChapterHead } from "@/components/ui/ChapterHead";
import { Cta } from "@/components/ui/Cta";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { chapters } from "@/lib/chapters";
import { featuredReviews } from "@/lib/reviews";
import { site } from "@/lib/site";

const chapter = chapters[6];

export function Ulasan() {
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
          lead="Empat pekerjaan, empat pengalaman. Ulasan lain ada di Google Maps."
        />

        <div className="quotes">
          {featuredReviews.map((review, index) => (
            <blockquote className="quote" key={`${review.name}-${review.date}`} data-sc-in>
              <span className="quote__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{review.text}</p>
              <footer>
                <cite>{review.name}</cite>
                <span>{review.date}</span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="ulasan__actions" data-sc-in>
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
