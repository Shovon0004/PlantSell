"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/sections/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import SiteFooter from "@/components/sections/SiteFooter";
import { useCart } from "@/lib/context/CartContext";

const UPLOAD_BASE = "http://localhost:5000";
function imgUrl(src: string) {
  if (!src) return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80";
  if (src.startsWith("http")) return src;
  return `${UPLOAD_BASE}${src}`;
}

const COUPON_MAP: Record<string, number> = {
  PLANT10: 10,
  GREEN20: 20,
  FIRST15: 15,
};

export default function CartPage() {
  const router = useRouter();
  const { items, cartTotal, updateQty, removeItem, clearCart } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponApplied, setCouponApplied] = useState("");

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (COUPON_MAP[code]) {
      setDiscount(COUPON_MAP[code]);
      setCouponApplied(code);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setDiscount(0);
    }
  };

  const delivery = cartTotal > 599 ? 0 : 59;
  const discountAmount = (cartTotal * discount) / 100;
  const finalTotal = cartTotal - discountAmount + delivery;

  return (
    <div className="cart-pg-root">
      <CustomCursor />
      <NavBar />

      <div className="cart-pg-inner">
        <div className="cart-pg-header">
          <h1 className="cart-pg-title">Your <em>Cart</em></h1>
          <p className="cart-pg-count">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>

        {items.length === 0 ? (
          <div className="cart-pg-empty">
            <div className="cart-pg-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="cart-pg-shop-btn">Start Shopping →</Link>
          </div>
        ) : (
          <div className="cart-pg-layout">
            {/* Items */}
            <div className="cart-pg-items">
              {items.map((item) => (
                <div key={item.productId} className="cart-pg-item">
                  <div className="cart-pg-item-img">
                    <img src={imgUrl(item.image)} alt={item.name} />
                  </div>
                  <div className="cart-pg-item-info">
                    <Link href={`/product/${item.productId}`} className="cart-pg-item-name">
                      {item.name}
                    </Link>
                    <div className="cart-pg-item-price">₹{item.price.toLocaleString()} each</div>
                    <div className="cart-pg-qty-row">
                      <button className="cart-pg-qty-btn" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                      <span className="cart-pg-qty-val">{item.quantity}</span>
                      <button className="cart-pg-qty-btn" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                      <button className="cart-pg-remove-btn" onClick={() => removeItem(item.productId)}>Remove</button>
                    </div>
                  </div>
                  <div className="cart-pg-item-subtotal">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="cart-pg-item-actions">
                <Link href="/shop" className="cart-pg-continue-btn">← Continue Shopping</Link>
                <button className="cart-pg-clear-btn" onClick={clearCart}>Clear Cart</button>
              </div>
            </div>

            {/* Summary */}
            <div className="cart-pg-summary">
              <h2 className="cart-pg-summary-title">Order Summary</h2>

              <div className="cart-pg-summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="cart-pg-summary-row cart-pg-discount-row">
                  <span>Discount ({couponApplied})</span>
                  <span>-₹{Math.round(discountAmount).toLocaleString()}</span>
                </div>
              )}
              <div className="cart-pg-summary-row">
                <span>Delivery</span>
                <span>{delivery === 0 ? <span className="cart-pg-free">FREE</span> : `₹${delivery}`}</span>
              </div>
              {delivery > 0 && (
                <p className="cart-pg-free-hint">Add ₹{(599 - cartTotal).toFixed(0)} more for free delivery</p>
              )}

              <div className="cart-pg-coupon">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. PLANT10)"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="cart-pg-coupon-input"
                />
                <button className="cart-pg-coupon-btn" onClick={applyCoupon}>Apply</button>
                {couponError && <p className="cart-pg-coupon-error">{couponError}</p>}
                {couponApplied && <p className="cart-pg-coupon-ok">✓ {couponApplied} applied!</p>}
              </div>

              <div className="cart-pg-total-row">
                <span>Total</span>
                <strong>₹{Math.round(finalTotal).toLocaleString()}</strong>
              </div>

              <button
                className="cart-pg-checkout-btn"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout →
              </button>
              <p className="cart-pg-secure-note">🔒 Secure checkout · 100% safe payments</p>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
