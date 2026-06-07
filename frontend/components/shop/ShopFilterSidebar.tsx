"use client";

export interface FilterState {
  categories: string[];
  priceMax: number;
  minRating: number;
  onSale: boolean;
  sameDay: boolean;
  inStock: boolean;
  sizes: string[];
}

interface ShopFilterSidebarProps {
  filters: FilterState;
  activeTab: string;
  onFiltersChange: (f: FilterState) => void;
  onClear: () => void;
}

const categoryOptions = [
  { id: "Indoor Plants", label: "Indoor Plants", count: 14 },
  { id: "Outdoor Trees", label: "Outdoor Trees", count: 11 },
  { id: "Fruit Tree", label: "Fruit Trees", count: 8 },
  { id: "Bonsai", label: "Bonsai", count: 6 },
  { id: "Flowering Shrub", label: "Flowering Shrubs", count: 9 },
  { id: "NPK Fertilizer", label: "NPK Fertilizers", count: 10 },
  { id: "Organic / Compost", label: "Organic / Compost", count: 12 },
  { id: "Liquid Fertilizer", label: "Liquid Fertilizers", count: 7 },
];

const sizeOptions = [
  { id: "small", label: "Small (under 2ft)", count: 18 },
  { id: "medium", label: "Medium (2–4ft)", count: 16 },
  { id: "large", label: "Large (4ft+)", count: 9 },
];

export default function ShopFilterSidebar({
  filters,
  activeTab,
  onFiltersChange,
  onClear,
}: ShopFilterSidebarProps) {
  const toggle = <K extends keyof FilterState>(key: K, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  return (
    <aside className="shop-filter-sidebar">
      <div className="shop-filter-head">
        <h3 className="shop-filter-title">Filters</h3>
        <button className="shop-clear-filters" onClick={onClear}>
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="shop-filter-group">
        <h4 className="shop-filter-group-title">Category</h4>
        {categoryOptions.map((opt) => (
          <label key={opt.id} className="shop-filter-option">
            <input
              type="checkbox"
              id={`cf-${opt.id}`}
              checked={filters.categories.includes(opt.id)}
              onChange={() => toggle("categories", opt.id)}
            />
            <span className="shop-filter-label">
              {opt.label}
              <span className="shop-filter-count">({opt.count})</span>
            </span>
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="shop-filter-group">
        <h4 className="shop-filter-group-title">Price Range</h4>
        <div className="shop-price-range">
          <input
            type="range"
            id="shopPriceSlider"
            className="shop-price-slider"
            min={0}
            max={5000}
            step={50}
            value={filters.priceMax}
            onChange={(e) =>
              onFiltersChange({ ...filters, priceMax: parseInt(e.target.value) })
            }
          />
          <div className="shop-price-labels">
            <span>₹0</span>
            <span>₹{filters.priceMax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="shop-filter-group">
        <h4 className="shop-filter-group-title">Rating</h4>
        <div className="shop-rating-filter">
          {[
            { val: 4, label: "★★★★☆ 4+ Stars" },
            { val: 3, label: "★★★☆☆ 3+ Stars" },
            { val: 0, label: "⭐ Any" },
          ].map((opt) => (
            <label key={opt.val} className="shop-star-filter">
              <input
                type="radio"
                name="shopRating"
                value={opt.val}
                checked={filters.minRating === opt.val}
                onChange={() =>
                  onFiltersChange({ ...filters, minRating: opt.val })
                }
              />
              <span className="shop-star-label">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="shop-filter-group">
        <h4 className="shop-filter-group-title">Availability</h4>
        <label className="shop-filter-option">
          <input
            type="checkbox"
            id="cf-instock"
            checked={filters.inStock}
            onChange={(e) =>
              onFiltersChange({ ...filters, inStock: e.target.checked })
            }
          />
          <span className="shop-filter-label">
            In Stock <span className="shop-filter-count">(48)</span>
          </span>
        </label>
        <label className="shop-filter-option">
          <input
            type="checkbox"
            id="cf-delivery"
            checked={filters.sameDay}
            onChange={(e) =>
              onFiltersChange({ ...filters, sameDay: e.target.checked })
            }
          />
          <span className="shop-filter-label">
            Same-Day Delivery <span className="shop-filter-count">(22)</span>
          </span>
        </label>
        <label className="shop-filter-option">
          <input
            type="checkbox"
            id="cf-onsale"
            checked={filters.onSale}
            onChange={(e) =>
              onFiltersChange({ ...filters, onSale: e.target.checked })
            }
          />
          <span className="shop-filter-label">
            On Sale <span className="shop-filter-count">(11)</span>
          </span>
        </label>
      </div>

      {/* Size (only when not on fertilizers tab) */}
      {activeTab !== "fertilizers" && (
        <div className="shop-filter-group">
          <h4 className="shop-filter-group-title">Plant Size</h4>
          {sizeOptions.map((opt) => (
            <label key={opt.id} className="shop-filter-option">
              <input
                type="checkbox"
                id={`sz-${opt.id}`}
                checked={filters.sizes.includes(opt.id)}
                onChange={() => toggle("sizes", opt.id)}
              />
              <span className="shop-filter-label">
                {opt.label}
                <span className="shop-filter-count">({opt.count})</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </aside>
  );
}
