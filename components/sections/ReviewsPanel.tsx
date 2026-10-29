import { ReviewForm } from "@/components/sections/ReviewForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { reviews } from "@/lib/reviews";
import { site } from "@/lib/site";

export function ReviewsPanel() {
  return (
    <div className="rvw rv">
      <h3>Kata mereka tentang Karya Alam</h3>

      <div className="review-list">
        {reviews.map((review) => (
          <article className="rc" key={`${review.name}-${review.date}`}>
            <q>“{review.text}”</q>
            <footer>
              <b>{review.name}</b>
              <span>{review.date}</span>
            </footer>
          </article>
        ))}
      </div>

      <div className="rb">
        <ButtonLink href={site.mapsUrl} variant="wa" external>
          ★ Tulis ulasan di Google Maps
        </ButtonLink>
      </div>

      <details>
        <summary>✍ Tulis ulasan Anda di sini</summary>
        <ReviewForm />
      </details>
    </div>
  );
}
