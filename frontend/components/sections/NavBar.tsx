"use client";

interface NavBarProps {
  cartCount: number;
  onCartOpen: () => void;
}

const navLinks = [
  { label: "Shop", href: "#categories" },
  { label: "Plants", href: "#products" },
  { label: "Delivery", href: "#delivery" },
  { label: "How It Works", href: "#hiw" },
  { label: "Reviews", href: "#testimonials" },
];

export default function NavBar({ cartCount, onCartOpen }: NavBarProps) {
  return (
    <nav id="navbar">
      <div className="logo">
        <span className="logo-leaf" />
        PlantSell
      </div>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <button className="btn-cart" onClick={onCartOpen}>
          Cart <span className="cart-badge">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
