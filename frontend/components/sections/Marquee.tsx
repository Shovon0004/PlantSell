const marqueeItems = [
  "Organic Fertilizers",
  "Indoor Plants",
  "Fruit Trees",
  "Free Home Delivery",
  "Flowering Shrubs",
  "NPK Blends",
  "Bonsai Starters",
  "Herb Gardens",
];

export default function Marquee() {
  const marqueeLoop = [...marqueeItems, ...marqueeItems];

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {marqueeLoop.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
