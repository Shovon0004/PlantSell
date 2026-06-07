"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, CartItem, Product } from "@/lib/api";
import { useAuth } from "./AuthContext";

// Local cart item for guest / optimistic UI
export interface LocalCartItem {
  _id: string;       // product._id or a temp id
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  cartItemId?: string; // server cart item _id
}

interface CartContextType {
  items: LocalCartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addItem: (product: Product, qty?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<void>;
  clearCart: () => void;
  syncWithServer: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

const LS_KEY = "ps_cart";

function toLocal(items: CartItem[]): LocalCartItem[] {
  return items.map((i) => ({
    _id: i.product._id,
    productId: i.product._id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.images?.[0] || "",
    quantity: i.quantity,
    cartItemId: i._id,
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // Sync from server when user logs in
  const syncWithServer = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.cart.get();
      if (res.data?.items) {
        setItems(toLocal(res.data.items));
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) syncWithServer();
  }, [user, syncWithServer]);

  const addItem = useCallback(async (product: Product, qty = 1) => {
    // Optimistic update
    setItems((prev) => {
      const existing = prev.find((x) => x.productId === product._id);
      if (existing) {
        return prev.map((x) =>
          x.productId === product._id ? { ...x, quantity: x.quantity + qty } : x
        );
      }
      return [
        ...prev,
        {
          _id: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity: qty,
        },
      ];
    });

    // Sync server if logged in
    if (user) {
      try {
        const res = await api.cart.add(product._id, qty);
        if ((res as { success: boolean; data: { items: CartItem[] } }).data?.items) {
          setItems(toLocal((res as { success: boolean; data: { items: CartItem[] } }).data.items));
        }
      } catch { /* keep optimistic */ }
    }
  }, [user]);

  const removeItem = useCallback(async (productId: string) => {
    const item = items.find((x) => x.productId === productId);
    setItems((prev) => prev.filter((x) => x.productId !== productId));

    if (user && item?.cartItemId) {
      try { await api.cart.remove(item.cartItemId); } catch { /* ignore */ }
    }
  }, [user, items]);

  const updateQty = useCallback(async (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    const item = items.find((x) => x.productId === productId);
    setItems((prev) =>
      prev.map((x) => (x.productId === productId ? { ...x, quantity: qty } : x))
    );

    if (user && item?.cartItemId) {
      try { await api.cart.update(item.cartItemId, qty); } catch { /* ignore */ }
    }
  }, [user, items, removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(LS_KEY);
  }, []);

  const cartCount = items.reduce((s, x) => s + x.quantity, 0);
  const cartTotal = items.reduce((s, x) => s + x.price * x.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, cartTotal, isLoading, addItem, removeItem, updateQty, clearCart, syncWithServer }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
