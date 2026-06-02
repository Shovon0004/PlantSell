const testimonials = [
  {
    stars: "*****",
    text:
      "My Fiddle Leaf Fig arrived in perfect condition with detailed care instructions. The packaging was eco-friendly and the plant was better than I expected. Will definitely order again!",
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    initial: "P",
  },
  {
    stars: "*****",
    text:
      "Ordered the NPK fertilizer and it worked wonders on my terrace garden within two weeks. The same-day delivery was a pleasant surprise. Fantastic service!",
    name: "Rajan Mehta",
    location: "Bangalore, Karnataka",
    initial: "R",
  },
  {
    stars: "****",
    text:
      "The dwarf mango tree is absolutely thriving! Got flowers within 3 months. Customer support helped me with a repotting question - really knowledgeable team.",
    name: "Anjali Nair",
    location: "Chennai, Tamil Nadu",
    initial: "A",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="t-header reveal">
        <div>
          <div className="section-label">Reviews</div>
          <h2 className="section-title">
            What Our <em>Customers</em> Say
          </h2>
        </div>
        <a className="see-all" href="#">
          All Reviews &gt;
        </a>
      </div>
      <div className="testimonials-grid reveal">
        {testimonials.map((testimonial) => (
          <div className="t-card" key={testimonial.name}>
            <div className="t-stars">{testimonial.stars}</div>
            <p className="t-text">"{testimonial.text}"</p>
            <div className="t-author">
              <div className="t-avatar">{testimonial.initial}</div>
              <div>
                <div className="t-name">{testimonial.name}</div>
                <div className="t-location">{testimonial.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
