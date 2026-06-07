"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CustomCursor from "@/components/sections/CustomCursor";
import { api, Order } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const STATUS_COLOR: Record<string, string> = {
  pending: "#e8a020", confirmed: "#5c8a3c", shipped: "#3d5a2e",
  delivered: "#1a2e1a", cancelled: "#c4683a",
};

export default function AdminOrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "admin") { router.push("/admin"); return; }
    fetchOrders();
  }, [user, isLoading, router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await api.admin.getOrders();
      setOrders(r.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.admin.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: status as Order["status"] } : o));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
    setUpdatingId(null);
  };

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const totalRevenue = orders.filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="adm-layout">
      <CustomCursor />
      <AdminSidebar />

      <div className="adm-content">
        <div className="adm-page-header">
          <div>
            <h1 className="adm-page-title">Orders</h1>
            <p className="adm-page-sub">{orders.length} total · ₹{totalRevenue.toFixed(0)} revenue</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="adm-filter-tabs">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              className={`adm-filter-tab ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="adm-filter-count">
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="adm-loading">Loading orders…</div>
        ) : (
          <div className="adm-table-card">
            <table className="adm-table adm-table--full">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const u = typeof o.user === "object" ? o.user : null;
                  return (
                    <tr key={o._id}>
                      <td className="adm-order-id">#{o._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="adm-customer-cell">
                          <div className="adm-customer-avatar">{(u?.name || "?")[0]}</div>
                          <div>
                            <div>{u?.name || "Guest"}</div>
                            <div className="adm-customer-email">{u?.email || ""}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          className="adm-items-link"
                          onClick={() => setSelectedOrder(o)}
                        >
                          {o.items.length} item{o.items.length !== 1 ? "s" : ""}
                        </button>
                      </td>
                      <td><strong>₹{o.totalAmount.toLocaleString()}</strong></td>
                      <td>
                        <span className="adm-pay-method">{o.paymentMethod?.toUpperCase()}</span>
                        <span className={`adm-pay-status ${o.paymentStatus === "paid" ? "paid" : ""}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                      <td>
                        <span className="adm-status-badge" style={{ background: STATUS_COLOR[o.status] }}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="adm-status-select"
                          value={o.status}
                          disabled={updatingId === o._id}
                          onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="adm-empty">No {statusFilter !== "all" ? statusFilter : ""} orders</div>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="adm-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              <button className="adm-modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
            <div className="adm-order-detail">
              <div className="adm-order-detail-section">
                <h3>Items</h3>
                {selectedOrder.items.map((item) => {
                  const p = item.product as { name?: string } | string;
                  const name = typeof p === "object" ? p.name : "Product";
                  return (
                    <div key={item._id || Math.random()} className="adm-order-item-row">
                      <span>{name}</span>
                      <span>× {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
                <div className="adm-order-item-row adm-order-total-row">
                  <strong>Total</strong>
                  <span />
                  <strong>₹{selectedOrder.totalAmount}</strong>
                </div>
              </div>
              <div className="adm-order-detail-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
