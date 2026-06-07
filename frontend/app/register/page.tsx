"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/sections/CustomCursor";
import { useAuth } from "@/lib/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-split-layout">
      <CustomCursor />
      
      {/* Left side - Image */}
      <div className="auth-image-panel" style={{ backgroundImage: "url('https://static.toiimg.com/photo/79679098.cms')" }}>
        <div className="auth-image-overlay">
          <Link href="/" className="auth-logo-overlay">
            <span className="logo-leaf" style={{ width: 32, height: 32, background: "#fff" }} />
            PlantSell
          </Link>
          <div className="auth-quote">
            <h2>&ldquo;He who plants a tree plants a hope.&rdquo;</h2>
            <p>&mdash; Lucy Larcom</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-header-new">
            <h1 className="auth-title-new">Create an account</h1>
            <p className="auth-subtitle-new">Join us and start bringing nature indoors.</p>
          </div>

          {error && <div className="auth-error-new">
            <span className="error-icon">⚠</span> {error}
          </div>}

          <form className="auth-form-new" onSubmit={handleSubmit}>
            <div className="auth-field-new">
              <input 
                id="name" 
                type="text" 
                placeholder=" " 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
              <label htmlFor="name">Full Name</label>
            </div>
            <div className="auth-field-new">
              <input 
                id="email" 
                type="email" 
                placeholder=" " 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                required 
              />
              <label htmlFor="email">Email Address</label>
            </div>
            <div className="auth-field-new">
              <input 
                id="password" 
                type="password" 
                placeholder=" " 
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                required 
              />
              <label htmlFor="password">Password</label>
            </div>
            <div className="auth-field-new">
              <input 
                id="confirm" 
                type="password" 
                placeholder=" " 
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })} 
                required 
              />
              <label htmlFor="confirm">Confirm Password</label>
            </div>
            
            <button type="submit" className="auth-submit-btn-new" disabled={loading}>
              {loading ? <span className="loader-ring"></span> : "Create Account"}
            </button>
          </form>

          <p className="auth-switch-new">
            Already have an account? <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
