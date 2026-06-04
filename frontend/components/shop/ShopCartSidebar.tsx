"use client";

import { Product } from "@/lib/api";

export interface ShopCartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
}

interface ShopCartSidebarProps {
  isOpen: boolean;
  items: ShopCartItem[];
  onClose: () => void;
  onQtyChange: (id: string, delta: number) => void;
}

export function productToCartItem(p: Product): ShopCartItem {
  return { id: p._id, name: p.name, price: p.price, qty: 1, img: p.images?.[0] || '/placeholder.jpg' };
}

export default function ShopCartSidebar({
  isOpen,
  items,
  onClose,
  onQtyChange,
}: ShopCartSidebarProps) {
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const freeDeliveryThreshold = 599;
  const remaining = freeDeliveryThreshold - total;

  return (
    <>
      <div
        className={`sp-overlay ${isOpen ? "sp-overlay--show" : ""}`}
        onClick={onClose}
      />
      <div className={`sp-cart-sidebar ${isOpen ? "sp-cart-sidebar--open" : ""}`}>
        <div className="sp-cart-header">
          <h3>Your Cart 🛒</h3>
          <button className="sp-close-cart" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="sp-cart-items">
          {items.length === 0 ? (
            <p className="sp-cart-empty">Your cart is empty 🌱</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="sp-cart-item">
                <div className="sp-cart-item__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.img} alt={item.name} />
                </div>
                <div className="sp-cart-item__info">
                  <div className="sp-cart-item__name">{item.name}</div>
                  <div className="sp-cart-item__price">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </div>
                  <div className="sp-qty-ctrl">
                    <button
                      className="sp-qty-btn"
                      onClick={() => onQtyChange(item.id, -1)}
                    >
                      −
                    </button>
                    <span className="sp-qty-val">{item.qty}</span>
                    <button
                      className="sp-qty-btn"
                      onClick={() => onQtyChange(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="sp-cart-footer">
          <div className="sp-delivery-note">
            {remaining > 0
              ? `Add ₹${remaining.toLocaleString()} more for free delivery 🚚`
              : "🎉 You qualify for free delivery!"}
          </div>
          <div className="sp-cart-total">
            <span>{count} item{count !== 1 ? "s" : ""}</span>
            <strong>₹{total.toLocaleString()}</strong>
          </div>
          <button className="sp-checkout-btn">Proceed to Checkout →</button>
        </div>
      </div>
    </>
  );
}
