"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";

const navItems = [
  { 
    href: "/admin/dashboard", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
      </svg>
    ), 
    label: "Dashboard" 
  },
  { 
    href: "/admin/products", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </svg>
    ), 
    label: "Products" 
  },
  { 
    href: "/admin/orders", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ), 
    label: "Orders" 
  },
  { 
    href: "/admin/customers", 
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ), 
    label: "Customers" 
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/admin");
  };

  return (
    <aside className="adm-sidebar">
      <div className="adm-sidebar-brand">
        <Link href="/admin/dashboard" className="adm-logo">
          <span className="logo-leaf" style={{ width: 24, height: 24, background: "#fff", display: "inline-block", borderRadius: "4px" }} />
          PlantSell
        </Link>
        <span className="adm-admin-badge">Admin</span>
      </div>

      <div className="adm-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`adm-nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span className="adm-nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="adm-sidebar-footer">
        <div className="adm-user-info">
          <div className="adm-user-avatar">{(user?.name || "A")[0]}</div>
          <div>
            <div className="adm-user-name">{user?.name}</div>
            <div className="adm-user-role">Administrator</div>
          </div>
        </div>
        <div className="adm-sidebar-links">
          <Link href="/" className="adm-view-site">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View Site
            </span>
          </Link>
          <button className="adm-logout-btn" onClick={handleLogout}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
