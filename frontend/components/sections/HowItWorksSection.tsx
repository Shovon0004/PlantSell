const steps = [
  {
    icon: "01",
    title: "Browse & Choose",
    text: "Explore our curated collection of plants, trees, and fertilizers with detailed care guides.",
    className: "s1",
  },
  {
    icon: "02",
    title: "Set Your Address",
    text: "Enter your delivery location. We deliver city-wide and to suburbs within 48 hours.",
    className: "s2",
  },
  {
    icon: "03",
    title: "Secure Checkout",
    text: "Pay safely via UPI, card, or cash on delivery. Your order is confirmed instantly.",
    className: "s3",
  },
  {
    icon: "04",
    title: "Fresh Delivery",
    text: "Your plants arrive eco-packed with a care guide. Track your order in real time.",
    className: "s4",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="hiw-section" id="hiw">
      <div className="hiw-header reveal">
        <div className="section-label">Process</div>
        <h2 className="section-title">
          How It <em>Works</em>
        </h2>
        <p className="section-subtitle" style={{ margin: "0 auto" }}>
          From browsing to blooming - in just four simple steps
        </p>
      </div>
      <div className="hiw-steps reveal">
        {steps.map((step) => (
          <div className="step" key={step.title}>
            <div className={`step-num ${step.className}`}>{step.icon}</div>
            <h4>{step.title}</h4>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
