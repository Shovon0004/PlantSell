"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomCursor from "@/components/sections/CustomCursor";
import { useAuth } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-split-layout">
      <CustomCursor />
      
      {/* Left side - Image */}
      <div className="auth-image-panel">
        <div className="auth-image-overlay">
          <Link href="/" className="auth-logo-overlay">
            <span className="logo-leaf" style={{ width: 32, height: 32, background: "#fff" }} />
            PlantSell
          </Link>
          <div className="auth-quote">
            <h2>&ldquo;To plant a garden is to believe in tomorrow.&ldquo;</h2>
            <p>— Audrey Hepburn</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-header-new">
            <h1 className="auth-title-new">Welcome back</h1>
            <p className="auth-subtitle-new">Please enter your details to sign in.</p>
          </div>

          {error && <div className="auth-error-new">
            <span className="error-icon">⚠</span> {error}
          </div>}

          <form className="auth-form-new" onSubmit={handleSubmit}>
            <div className="auth-field-new">
              <input
                id="email"
                type="email"
                placeholder=" "
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <label htmlFor="email">Email address</label>
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

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="#" className="auth-forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-submit-btn-new" disabled={loading}>
              {loading ? <span className="loader-ring"></span> : "Sign In"}
            </button>
          </form>

          <p className="auth-switch-new">
            Don&#39;t have an account? <Link href="/register">Sign up for free</Link>
          </p>

          <div className="auth-demo-credentials">
            <p className="demo-title">For testing purposes:</p>
            <div className="demo-accounts">
              <div><span>Demo</span><code>john@example.com</code> / <code>password123</code></div>
              <div><span>Admin</span><code>admin@plantb.com</code> / <code>admin123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
