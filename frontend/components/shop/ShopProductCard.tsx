"use client";

import { Product } from "@/lib/api";

interface ShopProductCardProps {
  product: Product;
  viewMode: string;
  index: number;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
  isWished: boolean;
  onToggleWish: (id: string) => void;
}

function starsHTML(r: number) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += i <= Math.round(r) ? "★" : "☆";
  return s;
}

function badgeClass(b: string | null) {
  if (b === "sale") return "sp-badge-sale";
  if (b === "new") return "sp-badge-new";
  if (b === "organic") return "sp-badge-organic";
  if (b === "hot") return "sp-badge-hot";
  return "";
}

export default function ShopProductCard({
  product: p,
  viewMode,
  index,
  onAddToCart,
  isAdded,
  isWished,
  onToggleWish,
}: ShopProductCardProps) {
  const delay = (index % 6) * 0.07;
  const ratingAvg = p.ratings?.average || 0;
  const ratingCount = p.ratings?.count || 0;
  const imgUrl = p.images?.[0] || '/placeholder.jpg';
  
  let badge = null;
  let badgeLabel = null;
  if (p.discount && p.discount > 0) {
    badge = "sale";
    badgeLabel = `-${p.discount}%`;
  } else if (p.isFeatured) {
    badge = "hot";
    badgeLabel = "Hot";
  }

  const oldPrice = p.discount ? Math.round(p.price / (1 - p.discount / 100)) : null;

  return (
    <div
      className={`sp-card ${viewMode === "list" ? "sp-card--list" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="sp-card__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgUrl} alt={p.name} loading="lazy" />
        {badge && (
          <span className={`sp-badge ${badgeClass(badge)}`}>
            {badgeLabel}
          </span>
        )}
        <button
          className="sp-wishlist-btn"
          onClick={() => onToggleWish(p._id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="sp-card__body">
        <div className="sp-card__category">{p.category}</div>
        <div className="sp-card__name">{p.name}</div>

        <div className="sp-card__tags">
          {p.tags?.map((tag) => (
            <span key={tag} className="sp-card__tag">
              {tag}
            </span>
          ))}
        </div>

        {viewMode === "list" && (
          <p className="sp-card__desc">{p.description}</p>
        )}

        <div className="sp-card__rating">
          <span className="sp-card__stars">{starsHTML(ratingAvg)}</span>
          <span className="sp-card__reviews">
            {ratingAvg} ({ratingCount})
          </span>
        </div>

        <div className="sp-card__footer">
          <div>
            <span className="sp-card__price">
              ₹{p.price.toLocaleString()}
            </span>
            {oldPrice && (
              <span className="sp-card__old-price">
                ₹{oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            className={`sp-add-btn ${isAdded ? "sp-add-btn--added" : ""}`}
            onClick={() => onAddToCart(p)}
            aria-label={`Add ${p.name} to cart`}
          >
            {isAdded ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
