"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import CustomCursor from "@/components/sections/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import SiteFooter from "@/components/sections/SiteFooter";
import { api, Product, Review } from "@/lib/api";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const UPLOAD_BASE = "http://localhost:5000";

function imgUrl(src: string) {
  if (!src) return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80";
  if (src.startsWith("http")) return src;
  return `${UPLOAD_BASE}${src}`;
}

function stars(n: number) {
  return Array.from({ length: 5 }, (_, i) => (i < Math.round(n) ? "★" : "☆")).join("");
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.products.get(id).then((r) => setProduct(r.data)).catch(() => {});
    api.products.reviews(id).then((r) => setReviews(r.data || [])).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addItem(product, qty);
    setAdded(true);
    setTimeout(() => { setAdded(false); setAdding(false); }, 1500);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addItem(product, qty);
    router.push("/cart");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setSubmittingReview(true);
    setReviewError("");
    try {
      await api.products.addReview(id, reviewForm);
      const r = await api.products.reviews(id);
      setReviews(r.data || []);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Failed to submit review");
    }
    setSubmittingReview(false);
  };

  if (!product) {
    return (
      <div className="pdp-loading">
        <CustomCursor />
        <NavBar />
        <div className="pdp-spinner">Loading product…</div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const allImages = product.images?.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80"];

  return (
    <div className="pdp-root">
      <CustomCursor />
      <NavBar />

      <div className="pdp-breadcrumb">
        <Link href="/">Home</Link> › <Link href="/shop">Shop</Link> ›{" "}
        <span>{product.name}</span>
      </div>

      {/* Main Product Section */}
      <section className="pdp-main">
        {/* Image Gallery */}
        <div className="pdp-gallery">
          <div className="pdp-main-img">
            <img src={imgUrl(allImages[activeImg])} alt={product.name} />
            {product.discount > 0 && (
              <span className="pdp-discount-badge">-{product.discount}%</span>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="pdp-thumbnails">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={imgUrl(img)} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="pdp-info">
          <div className="pdp-category">{product.category} › {product.type}</div>
          <h1 className="pdp-name">{product.name}</h1>

          <div className="pdp-rating-row">
            <span className="pdp-stars">{stars(product.ratings.average)}</span>
            <span className="pdp-rating-val">{product.ratings.average.toFixed(1)}</span>
            <span className="pdp-rating-count">({product.ratings.count} reviews)</span>
          </div>

          <div className="pdp-price-row">
            <span className="pdp-price">₹{Math.round(discountedPrice).toLocaleString()}</span>
            {product.discount > 0 && (
              <span className="pdp-old-price">₹{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="pdp-description">{product.description}</p>

          <div className="pdp-tags">
            {product.tags.map((t) => (
              <span key={t} className="pdp-tag">{t}</span>
            ))}
          </div>

          <div className="pdp-stock">
            {product.stock > 5 ? (
              <span className="pdp-instock">✓ In Stock ({product.stock} available)</span>
            ) : product.stock > 0 ? (
              <span className="pdp-lowstock">⚠ Only {product.stock} left!</span>
            ) : (
              <span className="pdp-outofstock">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity + Actions */}
          <div className="pdp-actions">
            <div className="pdp-qty">
              <button
                className="pdp-qty-btn"
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
              >−</button>
              <span className="pdp-qty-val">{qty}</span>
              <button
                className="pdp-qty-btn"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                disabled={qty >= product.stock}
              >+</button>
            </div>
            <button
              className={`pdp-add-btn ${added ? "pdp-add-btn--added" : ""}`}
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
            >
              {added ? "✓ Added!" : adding ? "Adding…" : "Add to Cart"}
            </button>
            <button
              className="pdp-buy-btn"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now →
            </button>
          </div>

          {/* Delivery Info */}
          <div className="pdp-delivery-info">
            <div className="pdp-delivery-item">🚚 <strong>Free delivery</strong> on orders above ₹599</div>
            <div className="pdp-delivery-item">📦 <strong>Same-day dispatch</strong> for orders before 2 PM</div>
            <div className="pdp-delivery-item">🌱 <strong>Live plant guarantee</strong> — healthy on arrival</div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="pdp-reviews">
        <h2 className="pdp-section-title">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="pdp-no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="pdp-reviews-grid">
            {reviews.map((r) => (
              <div key={r._id} className="pdp-review-card">
                <div className="pdp-review-header">
                  <div className="pdp-reviewer-avatar">
                    {(r.user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="pdp-reviewer-name">{r.user?.name || "Anonymous"}</div>
                    <div className="pdp-review-stars">{stars(r.rating)}</div>
                  </div>
                  <div className="pdp-review-date">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <p className="pdp-review-comment">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write a Review */}
        <div className="pdp-write-review">
          <h3>Write a Review</h3>
          {!user ? (
            <p>Please <Link href="/login">sign in</Link> to leave a review.</p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="pdp-review-form">
              {reviewError && <div className="auth-error">{reviewError}</div>}
              <div className="pdp-review-rating">
                <label>Rating:</label>
                <div className="pdp-star-select">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`pdp-star-btn ${n <= reviewForm.rating ? "active" : ""}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                    >★</button>
                  ))}
                </div>
              </div>
              <textarea
                className="pdp-review-textarea"
                placeholder="Share your experience with this product…"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
                required
              />
              <button type="submit" className="pdp-review-submit" disabled={submittingReview}>
                {submittingReview ? "Submitting…" : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
