"use client";

interface HeroProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export default function Hero({ onPrimaryClick, onSecondaryClick }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-tag">
          <span /> Free Delivery Over Rs 599
        </div>
        <h1>
          Bring <em>Nature Home,</em> One Plant at a Time
        </h1>
        <p>
          Premium fertilizers, rare saplings, and small trees delivered fresh to your
          doorstep with expert care guides.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={onPrimaryClick}>
            Shop Now
          </button>
          <button className="btn-outline" onClick={onSecondaryClick}>
            How It Works &gt;
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>2,400+</strong>
            <span>Plants Delivered</span>
          </div>
          <div className="hero-stat">
            <strong>98%</strong>
            <span>Happy Customers</span>
          </div>
          <div className="hero-stat">
            <strong>24hr</strong>
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-img-wrap">
          <img
            src="https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&q=80"
            alt="Beautiful indoor plants"
          />
        </div>
        <div className="hero-float-badge delivery">
          <div className="badge-icon green">DL</div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#8a9a7a", marginBottom: 2 }}>
              Today's Orders
            </div>
            <div>Free Delivery</div>
          </div>
        </div>
        <div className="hero-float-badge rating">
          <div className="badge-icon orange">RT</div>
          <div>
            <div>4.9 Rating</div>
            <div style={{ fontSize: "0.72rem", color: "#8a9a7a", marginTop: 2 }}>
              1,200+ reviews
            </div>
          </div>
        </div>
      </div>
      <div className="hero-bg-circle" />
    </section>
  );
}
