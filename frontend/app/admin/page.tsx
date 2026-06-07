"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CustomCursor from "@/components/sections/CustomCursor";
import { useAuth } from "@/lib/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "admin@plantb.com", password: "admin123" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect inside useEffect — never during render
  useEffect(() => {
    if (!isLoading && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
    setLoading(false);
  };

  if (isLoading || user?.role === "admin") return null;

  return (
    <div className="auth-split-layout">
      <CustomCursor />
      
      {/* Left side - Dark Admin Image */}
      <div className="auth-image-panel" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80')" }}>
        <div className="auth-image-overlay" style={{ background: "linear-gradient(135deg, rgba(15, 25, 15, 0.7) 0%, rgba(30, 45, 30, 0.8) 100%)" }}>
          <Link href="/" className="auth-logo-overlay">
            <span className="logo-leaf" style={{ width: 32, height: 32, background: "#fff" }} />
            PlantSell
          </Link>
          <div className="auth-quote">
            <h2>"Control your store. Manage your growth."</h2>
            <p>— Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-header-new">
            <h1 className="auth-title-new" style={{ color: "#1a2e1a" }}>Admin Access</h1>
            <p className="auth-subtitle-new">Please sign in to manage your store.</p>
          </div>

          {error && <div className="auth-error-new">
            <span className="error-icon">⚠</span> {error}
          </div>}

          <form className="auth-form-new" onSubmit={handleSubmit}>
            <div className="auth-field-new">
              <input
                id="adm-email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label htmlFor="adm-email">Admin Email</label>
            </div>
            
            <div className="auth-field-new">
              <input
                id="adm-pass"
                type="password"
                placeholder=" "
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <label htmlFor="adm-pass">Password</label>
            </div>

            <button type="submit" className="auth-submit-btn-new" disabled={loading} style={{ background: "#1a2e1a" }}>
              {loading ? <span className="loader-ring"></span> : "Enter Dashboard"}
            </button>
          </form>

          <p className="auth-switch-new">
            Not an admin? <Link href="/login">Go to Customer Login</Link>
          </p>

          <div className="auth-demo-credentials" style={{ marginTop: '32px' }}>
            <p className="demo-title">Admin Credentials:</p>
            <div className="demo-accounts">
              <div><span>Admin</span><code>admin@plantb.com</code> / <code>admin123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
