const deliveryFeatures = [
  {
    icon: "LN",
    title: "Live Plant Guarantee",
    text: "All plants arrive healthy or we replace them for free. No questions asked.",
    className: "fi-green",
  },
  {
    icon: "SD",
    title: "Same-Day Delivery",
    text: "Order before 12 PM and receive your plants the same evening within city limits.",
    className: "fi-orange",
  },
  {
    icon: "EP",
    title: "Eco-Friendly Packaging",
    text: "100% biodegradable packing with moisture-retention wraps for safe transit.",
    className: "fi-blue",
  },
];

export default function DeliverySection() {
  return (
    <section className="delivery-section" id="delivery">
      <div className="delivery-content reveal">
        <div className="section-label">Home Delivery</div>
        <h2 className="section-title">
          Fresh from <em>Our Nursery</em> to Your Door
        </h2>
        <p className="section-subtitle">
          We handle every plant with care - packed in biodegradable materials and
          delivered by trained green couriers who know how to handle live plants.
        </p>
        <div className="delivery-features">
          {deliveryFeatures.map((feature) => (
            <div className="delivery-feature" key={feature.title}>
              <div className={`feature-icon ${feature.className}`}>
                {feature.icon}
              </div>
              <div className="feature-text">
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="delivery-visual reveal">
        <div className="delivery-map-card">
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Live Delivery Tracking
          </div>
          <div className="map-placeholder">
            <div className="map-grid" />
            <div className="map-ring" />
            <div className="map-ring" />
            <div className="map-pin" />
          </div>
          <div className="delivery-time-badges">
            <div className="time-badge">
              <strong>24hr</strong>
              <span>City Wide</span>
            </div>
            <div className="time-badge">
              <strong>48hr</strong>
              <span>Suburbs</span>
            </div>
            <div className="time-badge">
              <strong>Free</strong>
              <span>Over Rs 599</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
