const categories = [
  {
    name: "Indoor Plants",
    count: "48 varieties",
    tag: "Best Seller",
    image:
      "https://image.cdn.shpy.in/76951/SKU-0784_0-1754830494898.jpg?width=600&format=webp",
  },
  {
    name: "Fertilizers",
    count: "32 products",
    tag: "Organic",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80",
  },
  {
    name: "Small Trees",
    count: "26 varieties",
    tag: "New",
    image:
      "https://www.advancedtreecareinc.com/wp-content/uploads/2017/03/planting-tree.jpeg",
  },
  {
    name: "Flowering Shrubs",
    count: "19 varieties",
    tag: null,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8d8hUZtw8Kqnlls-MdJ2UOGEXsKe61t-6hkp_37Rim7BBY6TzRH51lQQfZIA5qA8ddDNp157LytdDcMAboIXGPbhTrvx3eRcSK2IsbspR&s=10",
  },
];

export default function CategoriesSection() {
  return (
    <section className="categories-section" id="categories">
      <div className="categories-header reveal">
        <div>
          <div className="section-label">Browse</div>
          <h2 className="section-title">
            Shop by <em>Category</em>
          </h2>
        </div>
        <a className="see-all" href="#">
          View All &gt;
        </a>
      </div>
      <div className="categories-grid reveal">
        {categories.map((category) => (
          <div className="cat-card" key={category.name}>
            <img src={category.image} alt={category.name} />
            <div className="cat-overlay">
              <div className="cat-name">{category.name}</div>
              <div className="cat-count">{category.count}</div>
            </div>
            {category.tag ? <div className="cat-tag">{category.tag}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
