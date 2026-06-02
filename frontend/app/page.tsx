"use client";

import { useMemo, useState } from "react";
import CartSidebar from "@/components/sections/CartSidebar";
import CategoriesSection from "@/components/sections/CategoriesSection";
import CtaSection from "@/components/sections/CtaSection";
import CustomCursor from "@/components/sections/CustomCursor";
import DeliverySection from "@/components/sections/DeliverySection";
import Hero from "@/components/sections/Hero";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import Marquee from "@/components/sections/Marquee";
import NavBar from "@/components/sections/NavBar";
import PageEffects from "@/components/sections/PageEffects";
import ProductsSection from "@/components/sections/ProductsSection";
import SiteFooter from "@/components/sections/SiteFooter";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

const initialCartItems = [
  {
    id: "fiddle-leaf",
    name: "Fiddle Leaf Fig",
    price: 1299,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=200&q=80",
  },
  {
    id: "npk-blend",
    name: "NPK Premium Blend",
    price: 449,
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&q=80",
  },
  {
    id: "vermicompost",
    name: "Vermicompost 5kg",
    price: 299,
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1603436326446-74c1e516f6d0?w=200&q=80",
  },
];

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [activeFilter, setActiveFilter] = useState("All Products");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [cartItems, setCartItems] = useState(initialCartItems);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems]
  );

  const formatPrice = (price: number) => `Rs ${price.toLocaleString("en-IN")}`;

  const handleAddToCart = (id: string) => {
    setCartCount((count) => count + 1);
    setAdded((prev) => ({ ...prev, [id]: true }));
    window.setTimeout(() => {
      setAdded((prev) => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const handleQtyChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="backgroundColor">
      <CustomCursor />
      <PageEffects />

      <div
        className={`overlay ${cartOpen ? "show" : ""}`}
        onClick={() => setCartOpen(false)}
      />

      <NavBar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <Hero
        onPrimaryClick={() => scrollTo("products")}
        onSecondaryClick={() => scrollTo("hiw")}
      />
      <Marquee />
      <CategoriesSection />
      <ProductsSection
        activeFilter={activeFilter}
        favorites={favorites}
        added={added}
        onFilterChange={setActiveFilter}
        onAddToCart={handleAddToCart}
        onToggleFavorite={toggleFavorite}
        formatPrice={formatPrice}
      />
      <DeliverySection />
      <HowItWorksSection />
      {/* <TestimonialsSection /> */}
      <CtaSection />
      <SiteFooter />
      <CartSidebar
        cartOpen={cartOpen}
        items={cartItems}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onQtyChange={handleQtyChange}
        formatPrice={formatPrice}
      />
    </div>
  );
}
