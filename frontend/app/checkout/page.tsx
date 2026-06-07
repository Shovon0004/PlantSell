"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomCursor from "@/components/sections/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import SiteFooter from "@/components/sections/SiteFooter";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { api } from "@/lib/api";

const UPLOAD_BASE = "http://localhost:5000";
function imgUrl(src: string) {
  if (!src) return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&q=80";
  if (src.startsWith("http")) return src;
  return `${UPLOAD_BASE}${src}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    paymentMethod: "cod",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const delivery = cartTotal > 599 ? 0 : 59;
  const total = cartTotal + delivery;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) { router.push("/login?redirect=/checkout"); return; }
    if (items.length === 0) { router.push("/cart"); return; }

    setLoading(true);
    try {
      await api.orders.place({
        items: items.map((x) => ({ product: x.productId, quantity: x.quantity })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      router.push("/orders?success=1");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Order placement failed");
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="chk-root">
        <CustomCursor />
        <NavBar />
        <div className="chk-empty">
          <h2>Your cart is empty</h2>
          <Link href="/shop">Go to Shop →</Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="chk-root">
      <CustomCursor />
      <NavBar />

      <div className="chk-inner">
        <h1 className="chk-title">Checkout</h1>
        {error && <div className="auth-error" style={{ maxWidth: 700, margin: "0 auto 16px" }}>⚠ {error}</div>}

        <div className="chk-layout">
          {/* LEFT: Shipping Form */}
          <form className="chk-form" onSubmit={handleSubmit}>
            <div className="chk-section-label">1. Contact & Shipping</div>

            {!user && (
              <div className="chk-login-hint">
                <Link href="/login?redirect=/checkout">Sign in</Link> for faster checkout or continue as guest.
              </div>
            )}

            <div className="chk-fields-grid">
              <div className="chk-field">
                <label>Full Name *</label>
                <input type="text" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="chk-field">
                <label>Phone Number *</label>
                <input type="tel" value={form.phone} required pattern="[0-9]{10}"
                  placeholder="10-digit mobile"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="chk-field chk-field--full">
                <label>Street Address *</label>
                <input type="text" value={form.street} required placeholder="House no, building, street"
                  onChange={(e) => setForm({ ...form, street: e.target.value })} />
              </div>
              <div className="chk-field">
                <label>City *</label>
                <input type="text" value={form.city} required
                  onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="chk-field">
                <label>State *</label>
                <input type="text" value={form.state} required
                  onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="chk-field">
                <label>Pincode *</label>
                <input type="text" value={form.zipCode} required pattern="[0-9]{6}"
                  placeholder="6-digit pincode"
                  onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
              </div>
              <div className="chk-field">
                <label>Country</label>
                <input type="text" value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
            </div>

            <div className="chk-section-label">2. Payment Method</div>
            <div className="chk-payment-options">
              {[
                { value: "cod", label: "💵 Cash on Delivery" },
                { value: "upi", label: "📱 UPI" },
                { value: "card", label: "💳 Credit / Debit Card" },
              ].map((opt) => (
                <label key={opt.value} className={`chk-payment-opt ${form.paymentMethod === opt.value ? "active" : ""}`}>
                  <input type="radio" name="payment" value={opt.value}
                    checked={form.paymentMethod === opt.value}
                    onChange={() => setForm({ ...form, paymentMethod: opt.value })} />
                  {opt.label}
                </label>
              ))}
            </div>

            {(form.paymentMethod === "upi" || form.paymentMethod === "card") && (
              <div className="chk-payment-demo">
                <p>💡 <strong>Demo mode:</strong> No real payment processed. Order will be placed as COD equivalent.</p>
              </div>
            )}

            <button type="submit" className="chk-place-btn" disabled={loading}>
              {loading ? "Placing Order…" : `Place Order · ₹${Math.round(total).toLocaleString()}`}
            </button>
          </form>

          {/* RIGHT: Order Summary */}
          <div className="chk-summary">
            <h2 className="chk-summary-title">Order Summary</h2>
            <div className="chk-summary-items">
              {items.map((item) => (
                <div key={item.productId} className="chk-summary-item">
                  <div className="chk-summary-img">
                    <img src={imgUrl(item.image)} alt={item.name} />
                    <span className="chk-summary-qty">{item.quantity}</span>
                  </div>
                  <div className="chk-summary-name">{item.name}</div>
                  <div className="chk-summary-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
            <div className="chk-summary-divider" />
            <div className="chk-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="chk-summary-row">
              <span>Delivery</span>
              <span>{delivery === 0 ? <span className="cart-pg-free">FREE</span> : `₹${delivery}`}</span>
            </div>
            <div className="chk-summary-total">
              <span>Total</span>
              <strong>₹{Math.round(total).toLocaleString()}</strong>
            </div>
            <div className="chk-summary-badges">
              <span>🔒 Secure</span>
              <span>🌱 Guaranteed Fresh</span>
              <span>🚚 Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
