"use client";

import { Product } from "@/lib/api";
import ShopProductCard from "./ShopProductCard";

interface ShopProductsAreaProps {
  products: Product[];
  viewMode: string;
  currentPage: number;
  perPage: number;
  totalCount: number;
  addedIds: Set<string>;
  wishedIds: Set<string>;
  onAddToCart: (product: Product) => void;
  onToggleWish: (id: string) => void;
  onPageChange: (page: number) => void;
}

export default function ShopProductsArea({
  products,
  viewMode,
  currentPage,
  perPage,
  totalCount,
  addedIds,
  wishedIds,
  onAddToCart,
  onToggleWish,
  onPageChange,
}: ShopProductsAreaProps) {
  const totalPages = Math.ceil(totalCount / perPage);
  const start = (currentPage - 1) * perPage;
  const paginated = products.slice(start, start + perPage);

  return (
    <main className="sp-products-area">
      {paginated.length === 0 ? (
        <div className="sp-no-results">
          <div className="sp-no-results__emoji">🌱</div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className={`sp-products-grid ${viewMode === "list" ? "sp-products-grid--list" : ""}`}>
          {paginated.map((product, i) => (
            <ShopProductCard
              key={product._id}
              product={product}
              viewMode={viewMode}
              index={i}
              onAddToCart={onAddToCart}
              isAdded={addedIds.has(product._id)}
              isWished={wishedIds.has(product._id)}
              onToggleWish={onToggleWish}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="sp-pagination">
          {currentPage > 1 && (
            <button
              className="sp-page-btn"
              onClick={() => onPageChange(currentPage - 1)}
            >
              ‹
            </button>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`sp-page-btn ${page === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              className="sp-page-btn"
              onClick={() => onPageChange(currentPage + 1)}
            >
              ›
            </button>
          )}
        </div>
      )}
    </main>
  );
}
