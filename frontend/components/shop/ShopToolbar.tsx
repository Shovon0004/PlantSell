"use client";

interface ShopToolbarProps {
  searchQuery: string;
  sortMode: string;
  viewMode: string;
  resultCount: number;
  onSearch: (q: string) => void;
  onSort: (s: string) => void;
  onView: (v: string) => void;
}

export default function ShopToolbar({
  searchQuery,
  sortMode,
  viewMode,
  resultCount,
  onSearch,
  onSort,
  onView,
}: ShopToolbarProps) {
  return (
    <div className="shop-toolbar">
      <div className="shop-search-wrap">
        <span className="shop-search-icon">🔍</span>
        <input
          type="text"
          id="shopSearchInput"
          className="shop-search-input"
          placeholder="Search plants, fertilizers, trees…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          autoComplete="off"
        />
        {searchQuery && (
          <button
            className="shop-search-clear"
            onClick={() => onSearch("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <select
        id="shopSortSelect"
        className="shop-sort-select"
        value={sortMode}
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="default">Sort: Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
        <option value="new">Newest First</option>
      </select>

      <div className="shop-view-toggle">
        <button
          id="gridViewBtn"
          className={`shop-view-btn ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => onView("grid")}
          title="Grid view"
        >
          ⊞
        </button>
        <button
          id="listViewBtn"
          className={`shop-view-btn ${viewMode === "list" ? "active" : ""}`}
          onClick={() => onView("list")}
          title="List view"
        >
          ☰
        </button>
      </div>

      <span className="shop-result-count">
        Showing {resultCount} product{resultCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
