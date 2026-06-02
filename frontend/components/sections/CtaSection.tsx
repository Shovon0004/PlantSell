export default function CtaSection() {
  return (
    <section className="cta-section" id="cta">
      <h2>Get 10% Off Your First Order</h2>
      <p>
        Subscribe for seasonal plant guides, exclusive deals, and gardening tips
        straight to your inbox.
      </p>
      <div className="cta-form">
        <input type="email" placeholder="your@email.com" />
        <button>Subscribe</button>
      </div>
    </section>
  );
}
