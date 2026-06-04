"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/CartContext";
import { api, Product } from "@/lib/api";

const filterTabs = ["All Products", "Small Trees", "Fertilizers", "Flowering", "Indoor", "Fruit Trees"];

export default function ProductsSection() {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.products.featured().then((res) => {
      setProducts(res.data || []);
    }).catch(() => {});
  }, []);

  const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;

  const handleAdd = (product: Product) => {
    addItem(product);
    setAdded((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product._id]: false })), 1200);
  };

  return (
    <section className="products-section" id="products">
      <div className="products-header reveal">
        <div>
          <div className="section-label">Our Range</div>
          <h2 className="section-title">Featured <em>Products</em></h2>
        </div>
        <a className="see-all" href="/shop">View All &gt;</a>
      </div>
      <div className="filter-tabs reveal">
        {filterTabs.map((label) => (
          <button key={label} className={`filter-tab ${activeFilter === label ? "active" : ""}`} onClick={() => setActiveFilter(label)}>
            {label}
          </button>
        ))}
      </div>
      <div className="products-grid reveal">
        {products.map((product) => {
          const imgUrl = product.images?.[0] || "/placeholder.jpg";
          const ratingAvg = product.ratings?.average || 0;
          const ratingCount = product.ratings?.count || 0;
          const oldPrice = product.discount ? Math.round(product.price / (1 - product.discount / 100)) : null;
          
          return (
            <div className="product-card" key={product._id}>
              <div className="product-img">
                <Link href={`/product/${product._id}`}>
                  <img src={imgUrl} alt={product.name} />
                </Link>
                {product.discount > 0 && <div className="product-badge">-{product.discount}%</div>}
                {product.isFeatured && (!product.discount || product.discount === 0) && <div className="product-badge" style={{background: '#ff5722'}}>Hot</div>}
              </div>
              <div className="product-body">
                <div className="product-category">{product.category}</div>
                <Link href={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                  <div className="product-name">{product.name}</div>
                </Link>
                <div className="product-meta">
                  <span className="product-rating">{"★".repeat(Math.round(ratingAvg)) + "☆".repeat(5 - Math.round(ratingAvg))}</span>
                  <span className="product-reviews">({ratingCount})</span>
                </div>
                <div className="product-footer">
                  <div>
                    <span className="product-price">{formatPrice(product.price)}</span>
                    {oldPrice && <span className="product-price-old">{formatPrice(oldPrice)}</span>}
                  </div>
                  <button className="add-btn" onClick={() => handleAdd(product)}>
                    {added[product._id] ? "✓" : "+"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
