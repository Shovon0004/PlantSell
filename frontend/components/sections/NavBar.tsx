"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Delivery", href: "/#delivery" },
  { label: "How It Works", href: "/#hiw" },
];

export default function NavBar({ onCartOpen }: { onCartOpen?: () => void }) {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <nav id="navbar">
      <Link href="/" className="logo" style={{ textDecoration: "none" }}>
        <span className="logo-leaf" />
        PlantSell
      </Link>
      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        {user ? (
          <div className="nav-user">
            <span className="nav-user-name">Hi, {user.name.split(" ")[0]}</span>
            {user.role === "admin" && (
              <Link href="/admin/dashboard" className="nav-admin-link">Admin</Link>
            )}
            <Link href="/orders" className="nav-orders-link">Orders</Link>
            <button className="nav-logout-btn" onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <Link href="/login" className="nav-login-btn">Login</Link>
        )}
        <Link href="/cart" className="btn-cart">
          🛒 Cart <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}
