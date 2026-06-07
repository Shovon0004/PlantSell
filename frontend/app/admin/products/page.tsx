"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CustomCursor from "@/components/sections/CustomCursor";
import { api, Product } from "@/lib/api";
import { useAuth } from "@/lib/context/AuthContext";

const UPLOAD_BASE = "http://localhost:5000";
function imgUrl(src: string) {
  if (!src) return "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=80&q=80";
  if (src.startsWith("http")) return src;
  return `${UPLOAD_BASE}${src}`;
}

const CATEGORIES = ["plants", "medicines", "pots", "accessories"];
const TYPES: Record<string, string[]> = {
  plants: ["indoor", "outdoor", "succulents", "flowering"],
  medicines: ["fertilizer", "pesticides", "nutrients", "growth boosters"],
  pots: ["ceramic", "plastic", "hanging", "terracotta"],
  accessories: ["soil", "tools", "watering cans", "seeds"],
};

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  type: string;
  tags: string;
  discount: string;
  isFeatured: boolean;
  imageUrl: string;
}

const EMPTY_FORM: ProductForm = {
  name: "", description: "", price: "", stock: "",
  category: "plants", type: "indoor", tags: "",
  discount: "0", isFeatured: false, imageUrl: "",
};

export default function AdminProductsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [stockEdit, setStockEdit] = useState<{ id: string; value: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== "admin") { router.push("/admin"); return; }
    fetchProducts();
  }, [user, isLoading, router]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await api.products.list({ limit: 100 });
      setProducts(r.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
      type: p.type,
      tags: p.tags.join(", "),
      discount: String(p.discount),
      isFeatured: p.isFeatured,
      imageUrl: p.images?.[0] || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("category", form.category);
    fd.append("type", form.type);
    fd.append("tags", form.tags);
    fd.append("discount", form.discount);
    fd.append("isFeatured", String(form.isFeatured));
    if (form.imageUrl) fd.append("imageUrl", form.imageUrl);

    try {
      if (editProduct) {
        await api.admin.updateProduct(editProduct._id, fd);
      } else {
        await api.admin.createProduct(fd);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Operation failed");
    }
    setFormLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleStockSave = async (id: string) => {
    if (!stockEdit) return;
    try {
      await api.admin.updateStock(id, parseInt(stockEdit.value));
      setProducts((prev) =>
        prev.map((p) => p._id === id ? { ...p, stock: parseInt(stockEdit.value) } : p)
      );
      setStockEdit(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Stock update failed");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="adm-layout">
      <CustomCursor />
      <AdminSidebar />

      <div className="adm-content">
        <div className="adm-page-header">
          <div>
            <h1 className="adm-page-title">Products</h1>
            <p className="adm-page-sub">{products.length} total products</p>
          </div>
          <button className="adm-create-btn" onClick={openCreate}>+ Add Product</button>
        </div>

        <div className="adm-toolbar">
          <input
            className="adm-search"
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="adm-loading">Loading products…</div>
        ) : (
          <div className="adm-table-card">
            <table className="adm-table adm-table--full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div className="adm-product-cell">
                        <img className="adm-product-thumb" src={imgUrl(p.images?.[0])} alt={p.name} />
                        <div>
                          <div className="adm-product-name">{p.name}</div>
                          <div className="adm-product-type">{p.type}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-cat-badge">{p.category}</span></td>
                    <td>
                      ₹{p.price}
                      {p.discount > 0 && <span className="adm-discount-tag">-{p.discount}%</span>}
                    </td>
                    <td>
                      {stockEdit?.id === p._id ? (
                        <div className="adm-stock-edit">
                          <input
                            type="number"
                            value={stockEdit.value}
                            onChange={(e) => setStockEdit({ id: p._id, value: e.target.value })}
                            className="adm-stock-input"
                          />
                          <button className="adm-stock-save" onClick={() => handleStockSave(p._id)}>✓</button>
                          <button className="adm-stock-cancel" onClick={() => setStockEdit(null)}>✕</button>
                        </div>
                      ) : (
                        <button
                          className={`adm-stock-btn ${p.stock <= 5 ? "adm-stock-btn--low" : ""}`}
                          onClick={() => setStockEdit({ id: p._id, value: String(p.stock) })}
                        >
                          {p.stock} {p.stock <= 5 ? "⚠" : ""}
                        </button>
                      )}
                    </td>
                    <td>
                      <span className="adm-rating">★ {p.ratings.average.toFixed(1)}</span>
                      <span className="adm-rating-count"> ({p.ratings.count})</span>
                    </td>
                    <td>
                      <span className={`adm-avail-badge ${p.isAvailable ? "available" : "unavailable"}`}>
                        {p.isAvailable ? "Active" : "Hidden"}
                      </span>
                      {p.isFeatured && <span className="adm-featured-tag">Featured</span>}
                    </td>
                    <td>
                      <div className="adm-action-btns">
                        <button className="adm-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                        {deleteConfirm === p._id ? (
                          <>
                            <button className="adm-confirm-del-btn" onClick={() => handleDelete(p._id)}>Confirm</button>
                            <button className="adm-cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                          </>
                        ) : (
                          <button className="adm-delete-btn" onClick={() => setDeleteConfirm(p._id)}>Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="adm-empty">No products found</div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="adm-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h2>{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button className="adm-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {formError && <div className="auth-error">{formError}</div>}
            <form className="adm-modal-form" onSubmit={handleSubmit}>
              <div className="adm-form-grid">
                <div className="adm-form-field adm-form-field--full">
                  <label>Product Name *</label>
                  <input type="text" value={form.name} required
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="adm-form-field adm-form-field--full">
                  <label>Description *</label>
                  <textarea rows={3} value={form.description} required
                    onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="adm-form-field">
                  <label>Price (₹) *</label>
                  <input type="number" value={form.price} required min="0"
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="adm-form-field">
                  <label>Stock *</label>
                  <input type="number" value={form.stock} required min="0"
                    onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="adm-form-field">
                  <label>Category *</label>
                  <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value, type: TYPES[e.target.value]?.[0] || "" })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Type *</label>
                  <select value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {(TYPES[form.category] || []).map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="adm-form-field">
                  <label>Discount (%)</label>
                  <input type="number" value={form.discount} min="0" max="100"
                    onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
                <div className="adm-form-field">
                  <label>Tags (comma-separated)</label>
                  <input type="text" value={form.tags} placeholder="indoor, tropical, rare"
                    onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                </div>
                <div className="adm-form-field adm-form-field--full">
                  <label>Image URL</label>
                  <input type="text" value={form.imageUrl} placeholder="https://..."
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
                </div>
                <div className="adm-form-field adm-form-check">
                  <label>
                    <input type="checkbox" checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                    {" "}Mark as Featured
                  </label>
                </div>
              </div>
              <div className="adm-modal-actions">
                <button type="button" className="adm-cancel-btn adm-cancel-btn--large" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-create-btn" disabled={formLoading}>
                  {formLoading ? "Saving…" : editProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
