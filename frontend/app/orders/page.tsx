"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CustomCursor from "@/components/sections/CustomCursor";
import NavBar from "@/components/sections/NavBar";
import SiteFooter from "@/components/sections/SiteFooter";
import { api, Order } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#e8a020",
  confirmed: "#5c8a3c",
  shipped: "#3d5a2e",
  delivered: "#1a2e1a",
  cancelled: "#c4683a",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="ord-status-badge" style={{ background: STATUS_COLORS[status] || "#999" }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login?redirect=/orders");
      return;
    }
    api.orders.myOrders().then((r) => {
      setOrders(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, isLoading, router]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    setCancelling(id);
    try {
      await api.orders.cancel(id);
      setOrders((prev) =>
        prev.map((o) => o._id === id ? { ...o, status: "cancelled" } : o)
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to cancel order");
    }
    setCancelling(null);
  };

  return (
    <div className="ord-root">
      <CustomCursor />
      <NavBar />

      <div className="ord-inner">
        <div className="ord-header">
          <h1 className="ord-title">My <em>Orders</em></h1>
          <Link href="/shop" className="ord-shop-link">Continue Shopping →</Link>
        </div>

        {success && (
          <div className="ord-success-banner">
            🎉 Order placed successfully! We&apos;ll notify you when it ships.
          </div>
        )}

        {loading ? (
          <div className="ord-loading">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="ord-empty">
            <div className="ord-empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Your order history will appear here.</p>
            <Link href="/shop" className="cart-pg-shop-btn">Shop Now →</Link>
          </div>
        ) : (
          <div className="ord-list">
            {orders.map((order) => {
              const stepIdx = STATUS_STEPS.indexOf(order.status);
              return (
                <div key={order._id} className="ord-card">
                  <div className="ord-card-header">
                    <div>
                      <div className="ord-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div className="ord-date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </div>
                    </div>
                    <div className="ord-card-right">
                      <StatusBadge status={order.status} />
                      <div className="ord-total">₹{order.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== "cancelled" && (
                    <div className="ord-progress">
                      {STATUS_STEPS.map((step, i) => (
                        <div key={step} className={`ord-step ${i <= stepIdx ? "ord-step--done" : ""}`}>
                          <div className="ord-step-dot" />
                          <div className="ord-step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</div>
                          {i < STATUS_STEPS.length - 1 && <div className="ord-step-line" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Items Preview */}
                  <div className="ord-items-preview">
                    {order.items.slice(0, 3).map((item) => {
                      const p = item.product as { _id: string; name: string; images?: string[] } | string;
                      const name = typeof p === "object" ? p.name : "Product";
                      return (
                        <div key={item._id || Math.random()} className="ord-item-chip">
                          {name} × {item.quantity}
                        </div>
                      );
                    })}
                    {order.items.length > 3 && (
                      <div className="ord-item-chip ord-item-chip--more">
                        +{order.items.length - 3} more
                      </div>
                    )}
                  </div>

                  <div className="ord-card-footer">
                    <div className="ord-payment">
                      Payment: <strong>{order.paymentMethod?.toUpperCase()}</strong> ·{" "}
                      <span className={`ord-pay-status ${order.paymentStatus === "paid" ? "paid" : ""}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="ord-card-actions">
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <button
                          className="ord-cancel-btn"
                          onClick={() => handleCancel(order._id)}
                          disabled={cancelling === order._id}
                        >
                          {cancelling === order._id ? "Cancelling…" : "Cancel Order"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
