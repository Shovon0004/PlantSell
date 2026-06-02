"use client";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CartSidebarProps {
  cartOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onQtyChange: (id: string, delta: number) => void;
  formatPrice: (price: number) => string;
}

export default function CartSidebar({
  cartOpen,
  items,
  total,
  onClose,
  onQtyChange,
  formatPrice,
}: CartSidebarProps) {
  return (
    <div className={`cart-sidebar ${cartOpen ? "open" : ""}`} id="cartSidebar">
      <div className="cart-header-bar">
        <h3>Your Cart</h3>
        <button className="close-cart" onClick={onClose}>
          x
        </button>
      </div>
      <div className="cart-items">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <div className="cart-item-img">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">{formatPrice(item.price)}</div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => onQtyChange(item.id, -1)}>
                  -
                </button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => onQtyChange(item.id, 1)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div
          style={{
            fontSize: "0.8rem",
            color: "#8a9a7a",
            background: "rgba(92, 138, 60, 0.08)",
            padding: "10px 14px",
            borderRadius: "12px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Free delivery on this order
        </div>
        <div className="cart-total">
          <span>Total ({items.length} items)</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <button className="checkout-btn">Proceed to Checkout &gt;</button>
      </div>
    </div>
  );
}
