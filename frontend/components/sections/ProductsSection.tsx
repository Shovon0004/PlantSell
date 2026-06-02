"use client";

interface ProductsSectionProps {
  activeFilter: string;
  favorites: Record<string, boolean>;
  added: Record<string, boolean>;
  onFilterChange: (label: string) => void;
  onAddToCart: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  formatPrice: (price: number) => string;
}

const products = [
  {
    id: "fiddle-leaf",
    category: "Indoor Tree",
    name: "Fiddle Leaf Fig",
    price: 1299,
    oldPrice: 1599,
    rating: "*****",
    reviews: "(124)",
    badge: "-20%",
    image:
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=600&q=80",
  },
  {
    id: "npk-blend",
    category: "Fertilizer",
    name: "NPK Premium Blend 20-20-20",
    price: 449,
    oldPrice: null,
    rating: "*****",
    reviews: "(89)",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80",
  },
  {
    id: "mango",
    category: "Fruit Tree",
    name: "Dwarf Alphonso Mango",
    price: 2199,
    oldPrice: null,
    rating: "****",
    reviews: "(67)",
    badge: "Hot",
    image:
      "https://images.unsplash.com/photo-1621380401601-1c0e2e83c19e?w=600&q=80",
  },
  {
    id: "vermicompost",
    category: "Fertilizer",
    name: "Premium Vermicompost 5kg",
    price: 299,
    oldPrice: null,
    rating: "*****",
    reviews: "(203)",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1603436326446-74c1e516f6d0?w=600&q=80",
  },
  {
    id: "bonsai",
    category: "Bonsai",
    name: "Ficus Bonsai Starter Kit",
    price: 899,
    oldPrice: 1049,
    rating: "****",
    reviews: "(41)",
    badge: "-15%",
    image:
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&q=80",
  },
  {
    id: "hibiscus",
    category: "Flowering Shrub",
    name: "Double Hibiscus - Red",
    price: 549,
    oldPrice: null,
    rating: "*****",
    reviews: "(57)",
    badge: null,
    image:
      "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&q=80",
  },
];

const filterTabs = [
  "All Products",
  "Small Trees",
  "Fertilizers",
  "Flowering",
  "Indoor",
  "Fruit Trees",
];

export default function ProductsSection({
  activeFilter,
  favorites,
  added,
  onFilterChange,
  onAddToCart,
  onToggleFavorite,
  formatPrice,
}: ProductsSectionProps) {
  return (
    <section className="products-section" id="products">
      <div className="products-header reveal">
        <div>
          <div className="section-label">Our Range</div>
          <h2 className="section-title">
            Featured <em>Products</em>
          </h2>
        </div>
        <a className="see-all" href="#">
          View All &gt;
        </a>
      </div>
      <div className="filter-tabs reveal">
        {filterTabs.map((label) => (
          <button
            key={label}
            className={`filter-tab ${activeFilter === label ? "active" : ""}`}
            onClick={() => onFilterChange(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="products-grid reveal">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <div className="product-img">
              <img src={product.image} alt={product.name} />
              {product.badge ? (
                <div className="product-badge">{product.badge}</div>
              ) : null}
              <button
                className="wishlist-btn"
                onClick={() => onToggleFavorite(product.id)}
              >
                {favorites[product.id] ? "Liked" : "Like"}
              </button>
            </div>
            <div className="product-body">
              <div className="product-category">{product.category}</div>
              <div className="product-name">{product.name}</div>
              <div className="product-meta">
                <span className="product-rating">{product.rating}</span>
                <span className="product-reviews">{product.reviews}</span>
              </div>
              <div className="product-footer">
                <div>
                  <span className="product-price">{formatPrice(product.price)}</span>
                  {product.oldPrice ? (
                    <span className="product-price-old">
                      {formatPrice(product.oldPrice)}
                    </span>
                  ) : null}
                </div>
                <button className="add-btn" onClick={() => onAddToCart(product.id)}>
                  {added[product.id] ? "OK" : "+"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
