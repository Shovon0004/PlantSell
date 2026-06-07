"use client";

import { useState } from "react";
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
import { useCart } from "@/lib/context/CartContext";

export default function Home() {
  const [cartOpen, setCartOpen] = useState(false);
  const { items, cartTotal, updateQty } = useCart();

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  const handleQtyChange = (id: string, delta: number) => {
    const item = items.find((x) => x.productId === id);
    if (item) updateQty(id, item.quantity + delta);
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

      <NavBar onCartOpen={() => setCartOpen(true)} />
      <Hero
        onPrimaryClick={() => scrollTo("products")}
        onSecondaryClick={() => scrollTo("hiw")}
      />
      <Marquee />
      <CategoriesSection />
      <ProductsSection />
      <DeliverySection />
      <HowItWorksSection />
      <CtaSection />
      <SiteFooter />
      <CartSidebar
        cartOpen={cartOpen}
        items={items.map((x) => ({
          id: x.productId,
          name: x.name,
          price: x.price,
          qty: x.quantity,
          image: x.image,
        }))}
        total={cartTotal}
        onClose={() => setCartOpen(false)}
        onQtyChange={handleQtyChange}
        formatPrice={formatPrice}
      />
    </div>
  );
}
