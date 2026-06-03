"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CustomCursor from "@/components/sections/CustomCursor";
import { api, DashboardData, Order } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";

const UPLOAD_BASE = "http://localhost:5000";
function imgUrl(src: string) {
  if (!src) return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=80&q=80";
  if (src.startsWith("http")) return src;
  return `${UPLOAD_BASE}${src}`;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "#e8a020",
  confirmed: "#5c8a3c",
  shipped: "#3d5a2e",
  delivered: "#1a2e1a",
  cancelled: "#c4683a",
};

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<{ _id: string; revenue: number; orders: number }[]>([]);
  const [revenueperiod, setRevenuePeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "admin") { router.push("/admin"); return; }
    fetchDashboard();
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    api.admin.revenue(revenueperiod).then((r) => setRevenue(r.data || [])).catch(() => {});
  }, [revenueperiod, user]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dash, top] = await Promise.all([
        api.admin.dashboard(),
        api.admin.topProducts(),
      ]);
      setData(dash.data);
      setTopProducts(top.data || []);
      const rev = await api.admin.revenue("monthly");
      setRevenue(rev.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);

  if (loading || !data) {
    return (
      <div className="adm-layout">
        <CustomCursor />
        <AdminSidebar />
        <div className="adm-content adm-loading">Loading dashboard…</div>
      </div>
    );
  }

  return (
    <div className="adm-layout">
      <CustomCursor />
      <AdminSidebar />

      <div className="adm-content">
        <div className="adm-page-header">
          <h1 className="adm-page-title">Dashboard</h1>
          <p className="adm-page-sub">Welcome back, {user?.name?.split(" ")[0]} 👋</p>
        </div>

        {/* KPI Cards */}
        <div className="adm-kpi-grid">
          <div className="adm-kpi-card adm-kpi-green">
            <div className="adm-kpi-icon">💰</div>
            <div className="adm-kpi-label">Total Revenue</div>
            <div className="adm-kpi-value">₹{(data.totalRevenue || 0).toLocaleString()}</div>
          </div>
          <div className="adm-kpi-card adm-kpi-orange">
            <div className="adm-kpi-icon">📦</div>
            <div className="adm-kpi-label">Total Orders</div>
            <div className="adm-kpi-value">{data.totalOrders || 0}</div>
          </div>
          <div className="adm-kpi-card adm-kpi-blue">
            <div className="adm-kpi-icon">👥</div>
            <div className="adm-kpi-label">Customers</div>
            <div className="adm-kpi-value">{data.totalCustomers || 0}</div>
          </div>
          <div className="adm-kpi-card adm-kpi-red">
            <div className="adm-kpi-icon">⚠</div>
            <div className="adm-kpi-label">Low Stock</div>
            <div className="adm-kpi-value">{data.lowStockCount || 0}</div>
          </div>
        </div>

        <div className="adm-dash-grid">
          {/* Revenue Chart */}
          <div className="adm-widget">
            <div className="adm-widget-header">
              <h2 className="adm-widget-title">Revenue</h2>
              <div className="adm-period-tabs">
                {(["daily", "weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    className={`adm-period-tab ${revenueperiod === p ? "active" : ""}`}
                    onClick={() => setRevenuePeriod(p)}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="adm-bar-chart">
              {revenue.length === 0 ? (
                <p style={{ color: "var(--muted)", padding: "20px", textAlign: "center" }}>No revenue data yet</p>
              ) : (
                revenue.map((r) => {
                  const keyStr = typeof r._id === "object" ? `${r._id.year}-${r._id.week}` : String(r._id);
                  const labelStr = typeof r._id === "object" ? `W${r._id.week} '${String(r._id.year).slice(-2)}` : String(r._id);
                  return (
                    <div key={keyStr} className="adm-bar-item">
                      <div className="adm-bar-wrap">
                        <div
                          className="adm-bar"
                          style={{ height: `${Math.round((r.revenue / maxRevenue) * 100)}%` }}
                          title={`₹${r.revenue.toFixed(2)}`}
                        />
                      </div>
                      <div className="adm-bar-label">{labelStr}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="adm-widget">
            <div className="adm-widget-header">
              <h2 className="adm-widget-title">Recent Orders</h2>
              <a href="/admin/orders" className="adm-widget-link">View All →</a>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.recentOrders || []).slice(0, 6).map((o: Order) => (
                    <tr key={o._id}>
                      <td className="adm-order-id">#{o._id.slice(-6).toUpperCase()}</td>
                      <td>₹{o.totalAmount.toLocaleString()}</td>
                      <td>{o.paymentMethod?.toUpperCase()}</td>
                      <td>
                        <span className="adm-status-badge"
                          style={{ background: STATUS_COLOR[o.status] || "#999" }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products + Low Stock */}
        <div className="adm-dash-grid2">
          <div className="adm-widget">
            <div className="adm-widget-header">
              <h2 className="adm-widget-title">Top Selling Products</h2>
              <a href="/admin/products" className="adm-widget-link">Manage →</a>
            </div>
            <div className="adm-top-products">
              {topProducts.slice(0, 5).map((tp, i) => (
                <div key={tp._id} className="adm-top-product-row">
                  <span className="adm-rank">#{i + 1}</span>
                  <img className="adm-top-img" src={imgUrl(tp.images?.[0])} alt={tp.name} />
                  <div className="adm-top-info">
                    <div className="adm-top-name">{tp.name}</div>
                    <div className="adm-top-sub">{tp.quantitySold} sold</div>
                  </div>
                  <div className="adm-top-rev">₹{(tp.revenueGenerated || 0).toFixed(0)}</div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p style={{ color: "var(--muted)", padding: "20px", textAlign: "center" }}>No sales data yet</p>
              )}
            </div>
          </div>

          <div className="adm-widget">
            <div className="adm-widget-header">
              <h2 className="adm-widget-title">Low Stock Alerts</h2>
            </div>
            <div className="adm-low-stock">
              {(data.lowStockProducts || []).map((p) => (
                <div key={p._id} className="adm-low-stock-item">
                  <img className="adm-top-img" src={imgUrl(p.images?.[0])} alt={p.name} />
                  <div className="adm-top-info">
                    <div className="adm-top-name">{p.name}</div>
                    <div className="adm-low-stock-count" style={{ color: "#c4683a" }}>
                      {p.stock} left
                    </div>
                  </div>
                </div>
              ))}
              {(!data.lowStockProducts || data.lowStockProducts.length === 0) && (
                <p style={{ color: "var(--muted)", padding: "20px", textAlign: "center" }}>✓ All products well stocked</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
