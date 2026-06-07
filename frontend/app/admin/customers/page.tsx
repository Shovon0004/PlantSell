"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CustomCursor from "@/components/sections/CustomCursor";
import { api, User } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminCustomersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "admin") { router.push("/admin"); return; }
    fetchCustomers();
  }, [user, isLoading, router]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const r = await api.admin.getUsers();
      setCustomers(r.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    setTogglingId(id);
    try {
      await api.admin.blockUser(id, !isBlocked);
      setCustomers((prev) =>
        prev.map((c) => c._id === id ? { ...c, isBlocked: !isBlocked } : c)
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed");
    }
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteUser(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.filter((c) => c.role === "customer").length;
  const blockedCount = customers.filter((c) => c.isBlocked).length;

  return (
    <div className="adm-layout">
      <CustomCursor />
      <AdminSidebar />

      <div className="adm-content">
        <div className="adm-page-header">
          <div>
            <h1 className="adm-page-title">Customers</h1>
            <p className="adm-page-sub">{totalCustomers} customers · {blockedCount} blocked</p>
          </div>
        </div>

        <div className="adm-toolbar">
          <input
            className="adm-search"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="adm-loading">Loading customers…</div>
        ) : (
          <div className="adm-table-card">
            <table className="adm-table adm-table--full">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Role</th>
                  <th>Addresses</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className={c.isBlocked ? "adm-row--blocked" : ""}>
                    <td>
                      <div className="adm-customer-cell">
                        <div className="adm-customer-avatar" style={{ background: c.role === "admin" ? "var(--terracotta)" : "var(--leaf)" }}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="adm-customer-name">{c.name}</div>
                          <div className="adm-customer-email">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`adm-role-badge ${c.role === "admin" ? "adm-role-badge--admin" : ""}`}>
                        {c.role}
                      </span>
                    </td>
                    <td>{c.addresses?.length || 0}</td>
                    <td>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td>
                      <span className={`adm-avail-badge ${c.isBlocked ? "unavailable" : "available"}`}>
                        {c.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns">
                        {c.role !== "admin" && (
                          <button
                            className={c.isBlocked ? "adm-edit-btn" : "adm-delete-btn"}
                            onClick={() => handleToggleBlock(c._id, c.isBlocked)}
                            disabled={togglingId === c._id}
                          >
                            {togglingId === c._id ? "…" : c.isBlocked ? "Unblock" : "Block"}
                          </button>
                        )}
                        {c.role !== "admin" && (
                          <>
                            {deleteConfirm === c._id ? (
                              <>
                                <button className="adm-confirm-del-btn" onClick={() => handleDelete(c._id)}>Confirm</button>
                                <button className="adm-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                              </>
                            ) : (
                              <button className="adm-delete-btn" onClick={() => setDeleteConfirm(c._id)}>Delete</button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="adm-empty">No customers found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
