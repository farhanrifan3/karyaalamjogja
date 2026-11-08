import type { ReviewItem } from "@/lib/cms/reviews";
import type { SiteSettings } from "@/lib/cms/site-settings";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { ExternalIcon, Star } from "./icons";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" role="img" aria-label={`${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }).map((_, index) =>
        index < Math.round(rating) ? (
          <Star key={index} />
        ) : (
          <Star key={index} className="ic ic--empty" />
        ),
      )}
    </span>
  );
}

function average(items: ReviewItem[]): number {
  if (items.length === 0) return 0;
  return items.reduce((sum, item) => sum + (item.rating || 0), 0) / items.length;
}

function score(value: number): string {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function ReviewsSection({
  reviews,
  settings,
}: {
  reviews: ReviewItem[];
  settings: SiteSettings;
}) {
  const website = reviews.filter((review) => review.source !== "google");
  const google = reviews.filter((review) => review.source === "google");
  const websiteScore = average(website);
  const googleScore = average(google);

  return (
    <section className="reviews" id="testimoni" aria-labelledby="testimoni-title">
      <div className="wrap">
        <div className="section-head">
          <div className="section-head__copy">
            <p className="eyebrow">Testimoni</p>
            <h2 id="testimoni-title">Kata mereka setelah proyek selesai.</h2>
            <p className="lead">
              Ulasan website tampil setelah disetujui admin. Ulasan Google
              ditampilkan terpisah dengan label sumbernya.
            </p>
          </div>
        </div>

        <div className="rating-row">
          <div className="rating">
            <p className="rating__score">{score(websiteScore)}</p>
            <div className="rating__body">
              <p className="rating__label">
                Rating website
                <Stars rating={websiteScore} />
              </p>
              <p className="rating__meta">
                {website.length} ulasan website yang disetujui
              </p>
            </div>
          </div>
          <div className="rating">
            <p className="rating__score">{score(googleScore)}</p>
            <div className="rating__body">
              <p className="rating__label">
                Rating Google
                <span className="rating__badge">Google</span>
              </p>
              <p className="rating__meta">
                {google.length} ulasan Google · ditampilkan terpisah
              </p>
            </div>
          </div>
        </div>

        <div className="review-grid">
          {website.slice(0, 6).map((review) => (
            <article className="review" key={review.id}>
              <Stars rating={review.rating || 5} />
              <p className="review__text">“{review.text}”</p>
              <div className="review__foot">
                <span className="avatar" aria-hidden="true">
                  {review.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="review__who">
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </span>
                <span className="review__src review__src--web">Website</span>
              </div>
            </article>
          ))}
        </div>

        {website.length > 1 ? (
          <p className="review-swipe-hint" aria-hidden="true">
            Geser untuk melihat ulasan lainnya →
          </p>
        ) : null}

        <div className="review-tools">
          <div className="card">
            <h3 className="card__title">Tulis ulasan Anda.</h3>
            <p className="card__lead">
              Ulasan masuk ke antrean moderasi dan baru tampil setelah disetujui
              admin. Kami tidak mengubah isi tanpa penanda.
            </p>
            <ReviewForm />
          </div>

          <aside className="google-panel">
            <div className="google-head">
              <span className="google-g" aria-hidden="true">
                G
              </span>
              <h3>Ulasan Google</h3>
            </div>

            {google.length > 0 ? (
              <div className="google-reviews">
                {google.slice(0, 5).map((review) => (
                  <div className="google-review" key={review.id}>
                    <Stars rating={review.rating || 5} />
                    <p>“{review.text}”</p>
                    <span>
                      {review.name} · {review.date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                Ulasan Google ditampilkan terpisah dengan label sumber. Ulasan
                Google tidak dapat kami edit atau hapus.
              </p>
            )}

            <a
              className="btn btn--lime btn--block"
              href={settings.mapsDirectionUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tulis juga di Google Maps
              <ExternalIcon />
            </a>
            <p className="google-note">
              Ulasan Google tetap menjadi milik penulisnya. Rating Google tidak
              digabung dengan rating website.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
