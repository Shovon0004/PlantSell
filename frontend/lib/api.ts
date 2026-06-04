// Central API client for the PlantSell backend (http://localhost:5000)
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ps_access_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const rt = localStorage.getItem("ps_refresh_token");
  if (!rt) return null;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    localStorage.setItem("ps_access_token", data.data.accessToken);
    return data.data.accessToken;
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, options, false);
    }
    // Clear auth on 401
    localStorage.removeItem("ps_access_token");
    localStorage.removeItem("ps_refresh_token");
    localStorage.removeItem("ps_user");
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(errBody.message || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// ---- AUTH ----
export const api = {
  auth: {
    register: async (data: { name: string; email: string; password: string }) => {
      const res = await request<{ success: boolean; data: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { accessToken, refreshToken, ...user } = res.data;
      return { accessToken, refreshToken, user: user as User };
    },
    login: async (data: { email: string; password: string }) => {
      const res = await request<{ success: boolean; data: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { accessToken, refreshToken, ...user } = res.data;
      return { accessToken, refreshToken, user: user as User };
    },
    logout: (refreshToken: string) =>
      request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
  },

  // ---- PRODUCTS ----
  products: {
    list: (params?: Record<string, string | number>) => {
      const q = params ? "?" + new URLSearchParams(params as Record<string, string>).toString() : "";
      return request<{ success: boolean; count: number; total: number; pages: number; data: Product[] }>(`/products${q}`);
    },
    search: (q: string) =>
      request<{ success: boolean; data: Product[] }>(`/products/search?q=${encodeURIComponent(q)}`),
    featured: () =>
      request<{ success: boolean; data: Product[] }>("/products/featured"),
    get: (id: string) =>
      request<{ success: boolean; data: Product }>(`/products/${id}`),
    reviews: (id: string) =>
      request<{ success: boolean; data: Review[] }>(`/products/${id}/reviews`),
    addReview: (id: string, data: { rating: number; comment: string }) =>
      request(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ---- CATEGORIES ----
  categories: {
    list: () => request<{ success: boolean; count: number; data: Category[] }>("/categories"),
  },

  // ---- CART ----
  cart: {
    get: () => request<{ success: boolean; data: CartData }>("/cart"),
    add: (productId: string, quantity: number) =>
      request("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }),
    update: (itemId: string, quantity: number) =>
      request(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity }),
      }),
    remove: (itemId: string) =>
      request(`/cart/${itemId}`, { method: "DELETE" }),
  },

  // ---- WISHLIST ----
  wishlist: {
    get: () => request<{ success: boolean; data: WishlistData }>("/wishlist"),
    toggle: (productId: string) =>
      request(`/wishlist/${productId}`, { method: "POST" }),
  },

  // ---- ORDERS ----
  orders: {
    place: (data: OrderPayload) =>
      request<{ success: boolean; data: Order }>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    myOrders: () =>
      request<{ success: boolean; data: Order[] }>("/orders/my-orders"),
    get: (id: string) =>
      request<{ success: boolean; data: Order }>(`/orders/${id}`),
    cancel: (id: string) =>
      request(`/orders/${id}/cancel`, { method: "POST" }),
  },

  // ---- PROFILE ----
  profile: {
    get: () => request<{ success: boolean; data: User }>("/profile"),
    update: (data: Partial<User>) =>
      request("/profile", { method: "PUT", body: JSON.stringify(data) }),
    changePassword: (oldPassword: string, newPassword: string) =>
      request("/profile/change-password", {
        method: "PUT",
        body: JSON.stringify({ oldPassword, newPassword }),
      }),
    addAddress: (addr: Address) =>
      request("/profile/address", {
        method: "POST",
        body: JSON.stringify(addr),
      }),
    updateAddress: (id: string, addr: Partial<Address>) =>
      request(`/profile/address/${id}`, {
        method: "PUT",
        body: JSON.stringify(addr),
      }),
    deleteAddress: (id: string) =>
      request(`/profile/address/${id}`, { method: "DELETE" }),
  },

  // ---- ADMIN ----
  admin: {
    dashboard: () =>
      request<{ success: boolean; data: DashboardData }>("/admin/dashboard"),
    topProducts: () =>
      request<{ success: boolean; data: TopProduct[] }>("/admin/analytics/top-products"),
    revenue: (period: "daily" | "weekly" | "monthly") =>
      request<{ success: boolean; data: RevenueData[] }>(`/admin/analytics/revenue?period=${period}`),

    // Products
    createProduct: (formData: FormData) =>
      request("/admin/products", { method: "POST", body: formData }),
    updateProduct: (id: string, formData: FormData) =>
      request(`/admin/products/${id}`, { method: "PUT", body: formData }),
    deleteProduct: (id: string) =>
      request(`/admin/products/${id}`, { method: "DELETE" }),
    updateStock: (id: string, stock: number) =>
      request(`/admin/products/${id}/stock`, {
        method: "PUT",
        body: JSON.stringify({ stock }),
      }),

    // Orders
    getOrders: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ success: boolean; data: Order[]; total: number }>(`/admin/orders${q}`);
    },
    getOrder: (id: string) =>
      request<{ success: boolean; data: Order }>(`/admin/orders/${id}`),
    updateOrderStatus: (id: string, status: string) =>
      request(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),

    // Users/Customers
    getUsers: () =>
      request<{ success: boolean; data: User[] }>("/admin/users"),
    getUser: (id: string) =>
      request<{ success: boolean; data: User }>(`/admin/users/${id}`),
    blockUser: (id: string, isBlocked: boolean) =>
      request(`/admin/users/${id}/block`, {
        method: "PUT",
        body: JSON.stringify({ isBlocked }),
      }),
    deleteUser: (id: string) =>
      request(`/admin/users/${id}`, { method: "DELETE" }),

    // Categories
    createCategory: (data: { name: string; description: string; subcategories?: string[] }) =>
      request("/admin/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateCategory: (id: string, data: Partial<Category>) =>
      request(`/admin/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteCategory: (id: string) =>
      request(`/admin/categories/${id}`, { method: "DELETE" }),
  },
};

// ---- TYPES ----
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  isBlocked: boolean;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  type: string;
  tags: string[];
  ratings: { average: number; count: number };
  discount: number;
  isFeatured: boolean;
  isAvailable: boolean;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface CartData {
  _id: string;
  items: CartItem[];
}

export interface WishlistData {
  _id: string;
  products: Product[];
}

export interface Review {
  _id: string;
  user: { _id: string; name: string };
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  subcategories: string[];
}

export interface OrderItem {
  _id?: string;
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export interface OrderPayload {
  items: { product: string; quantity: number }[];
  shippingAddress: Omit<Address, "_id" | "isDefault">;
  paymentMethod: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

export interface TopProduct {
  _id: string;
  name: string;
  category: string;
  type: string;
  images: string[];
  quantitySold: number;
  revenueGenerated: number;
}

export interface RevenueData {
  _id: string | { year: number; week?: number; month?: number; day?: number };
  revenue: number;
  orders: number;
}
