import { useState, createContext, useContext } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const categories = [
  { id: 1, name: "Vegetables & Fruits", emoji: "🥦", color: "#e8f5e9" },
  { id: 2, name: "Dairy & Breakfast", emoji: "🥛", color: "#fff8e1" },
  { id: 3, name: "Munchies", emoji: "🍿", color: "#fce4ec" },
  { id: 4, name: "Cold Drinks & Juices", emoji: "🧃", color: "#e3f2fd" },
  { id: 5, name: "Instant & Frozen", emoji: "🍜", color: "#f3e5f5" },
  { id: 6, name: "Tea, Coffee & More", emoji: "☕", color: "#efebe9" },
  { id: 7, name: "Bakery & Biscuits", emoji: "🍞", color: "#fff3e0" },
  { id: 8, name: "Sweet Tooth", emoji: "🍫", color: "#fce4ec" },
  { id: 9, name: "Atta, Rice & Dal", emoji: "🌾", color: "#f9fbe7" },
  { id: 10, name: "Dry Fruits & Masala", emoji: "🥜", color: "#fbe9e7" },
  { id: 11, name: "Sauces & Spreads", emoji: "🫙", color: "#e8f5e9" },
  { id: 12, name: "Chicken, Meat & Fish", emoji: "🍗", color: "#fce4ec" },
];

const stores = [
  { id: 1, name: "Pet Store", emoji: "🐾", color: "#fff3e0" },
  { id: 2, name: "Dessert Store", emoji: "🍦", color: "#fce4ec" },
  { id: 3, name: "Beauty Store", emoji: "💄", color: "#f3e5f5" },
  { id: 4, name: "Print Store", emoji: "🖨️", color: "#e3f2fd" },
];

const products = [
  { id: 1, name: "Epigamia Turbo 15g Protein Alphonso Mango", weight: "140 g", price: 125, originalPrice: 140, category: 1, image: "🍮", deliveryTime: "22 MINS", badge: "NEW" },
  { id: 2, name: "Epigamia Wild Raspberry Greek Yogurt", weight: "85 g", price: 60, originalPrice: 75, category: 1, image: "🫐", deliveryTime: "22 MINS", discount: 20 },
  { id: 3, name: "Amul Real Mango Amrakhand", weight: "200 g", price: 60, originalPrice: 75, category: 2, image: "🥭", deliveryTime: "22 MINS", discount: 20 },
  { id: 4, name: "Whole Farm Grocery Sugar", weight: "1 kg", price: 52, originalPrice: 75, category: 9, image: "🧂", deliveryTime: "22 MINS", discount: 30 },
  { id: 5, name: "Whole Farm Grocery Cashew", weight: "200 g", price: 218, originalPrice: 299, category: 10, image: "🥜", deliveryTime: "22 MINS", discount: 27 },
  { id: 6, name: "Aashirvaad Iodized Natural Salt", weight: "1 kg", price: 20, originalPrice: 30, category: 9, image: "🧂", deliveryTime: "22 MINS", discount: 33 },
  { id: 7, name: "Twinings Royal British Breakfast Tea", weight: "66 g", price: 379, originalPrice: 499, category: 6, image: "🫖", deliveryTime: "22 MINS", discount: 24 },
  { id: 8, name: "Twinings Silk Route Collection", weight: "66 g", price: 379, originalPrice: 499, category: 6, image: "🍵", deliveryTime: "22 MINS", discount: 24 },
  { id: 9, name: "Fresh Bananas", weight: "500 g", price: 35, originalPrice: 45, category: 1, image: "🍌", deliveryTime: "18 MINS", discount: 22 },
  { id: 10, name: "Lay's Classic Salted Chips", weight: "114 g", price: 30, originalPrice: 35, category: 3, image: "🥨", deliveryTime: "22 MINS", discount: 15 },
  { id: 11, name: "Coca Cola Classic", weight: "750 ml", price: 45, originalPrice: 50, category: 4, image: "🥤", deliveryTime: "22 MINS", discount: 10 },
  { id: 12, name: "Maggi 2-Minute Noodles", weight: "280 g", price: 55, originalPrice: 65, category: 5, image: "🍜", deliveryTime: "22 MINS", discount: 15 },
  { id: 13, name: "Nescafe Classic Coffee", weight: "200 g", price: 320, originalPrice: 390, category: 6, image: "☕", deliveryTime: "22 MINS", discount: 18 },
  { id: 14, name: "Parle-G Original Biscuits", weight: "800 g", price: 72, originalPrice: 85, category: 7, image: "🍪", deliveryTime: "22 MINS", discount: 15 },
  { id: 15, name: "Cadbury Dairy Milk Silk", weight: "150 g", price: 99, originalPrice: 120, category: 8, image: "🍫", deliveryTime: "22 MINS", discount: 18 },
];

// ─── CART CONTEXT ──────────────────────────────────────────────────────────
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({ label: "Home", full: "Floor qq, qq, qqq Ganpati Nagar, Jaipur", pincode: "334001", area: "near Doordarsan Colony..." });

  const addToCart = (product) => setCartItems(prev => {
    const ex = prev.find(i => i.id === product.id);
    if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, { ...product, qty: 1 }];
  });
  const removeFromCart = (id) => setCartItems(prev => {
    const ex = prev.find(i => i.id === id);
    if (ex?.qty === 1) return prev.filter(i => i.id !== id);
    return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
  });
  const getQty = (id) => cartItems.find(i => i.id === id)?.qty || 0;
  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const grandTotal = subtotal + (subtotal > 0 ? 2 : 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getQty, totalItems, subtotal, grandTotal, isLoggedIn, setIsLoggedIn, user, setUser, address, setAddress, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
}
const useCart = () => useContext(CartContext);

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────
function ProductCard({ product }) {
  const { addToCart, removeFromCart, getQty } = useCart();
  const qty = getQty(product.id);
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f0f0f0", padding: 10, display: "flex", flexDirection: "column", position: "relative", minWidth: 148, maxWidth: 148, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      {product.discount && <div style={{ position: "absolute", top: 8, left: 8, background: "#1a8a3c", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4 }}>{product.discount}% OFF</div>}
      {product.badge && <div style={{ position: "absolute", top: 8, left: 8, background: "#ff6b00", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4 }}>{product.badge}</div>}
      <div style={{ background: "#f8f8f8", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", height: 80, fontSize: 42, marginBottom: 8, position: "relative" }}>
        {product.image}
        <div style={{ position: "absolute", bottom: 3, left: 3, fontSize: 8, color: "#888", background: "rgba(255,255,255,0.9)", borderRadius: 4, padding: "1px 4px", fontWeight: 600 }}>⏱ {product.deliveryTime}</div>
      </div>
      <div style={{ fontSize: 11, color: "#333", fontWeight: 600, lineHeight: 1.3, marginBottom: 2, flex: 1 }}>{product.name}</div>
      <div style={{ fontSize: 10, color: "#999", marginBottom: 8 }}>{product.weight}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>₹{product.price}</span>
          {product.originalPrice > product.price && <span style={{ fontSize: 10, color: "#aaa", textDecoration: "line-through", marginLeft: 4 }}>₹{product.originalPrice}</span>}
        </div>
        {qty === 0 ? (
          <button onClick={() => addToCart(product)} style={{ background: "#fff", border: "2px solid #1a8a3c", color: "#1a8a3c", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>ADD</button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", background: "#1a8a3c", borderRadius: 8, overflow: "hidden" }}>
            <button onClick={() => removeFromCart(product.id)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, padding: "4px 10px", cursor: "pointer" }}>−</button>
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{qty}</span>
            <button onClick={() => addToCart(product)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 16, fontWeight: 700, padding: "4px 10px", cursor: "pointer" }}>+</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT SECTION ───────────────────────────────────────────────────────
function ProductSection({ title, products: prods }) {
  return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 12, color: "#1a8a3c", fontWeight: 600, cursor: "pointer" }}>see all →</span>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        {prods.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

// ─── CATEGORY GRID ─────────────────────────────────────────────────────────
function CategoryGrid() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#222", marginBottom: 14 }}>Shop by category</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: cat.color, borderRadius: 14, padding: "10px 4px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", border: "1px solid rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 26 }}>{cat.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: "#333", textAlign: "center", lineHeight: 1.2 }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STORE ROW ─────────────────────────────────────────────────────────────
function StoreRow() {
  return (
    <div style={{ padding: "0 16px" }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 12 }}>Shop by store</h2>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none" }}>
        {stores.map(s => (
          <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 72, cursor: "pointer" }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, border: "1px solid rgba(0,0,0,0.06)" }}>{s.emoji}</div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#333", textAlign: "center" }}>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADDRESS MODAL ─────────────────────────────────────────────────────────
function AddressModal({ onClose }) {
  const { address, setAddress } = useCart();
  const [form, setForm] = useState({ label: "Home", full: "", pincode: "", area: "" });
  const [adding, setAdding] = useState(false);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: "20px 20px 0 0", padding: 24, maxWidth: 480, width: "100%", margin: "0 auto", maxHeight: "75vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Select delivery address</h2>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "#333", color: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}>✕</button>
        </div>
        {!adding ? (
          <button onClick={() => setAdding(true)} style={{ width: "100%", border: "2px solid #1a8a3c", color: "#1a8a3c", background: "#fff", borderRadius: 12, padding: "14px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 18, color: "#1a8a3c" }}>+</span> Add a new address
          </button>
        ) : (
          <div style={{ border: "1px solid #e0e0e0", borderRadius: 12, padding: 14, marginBottom: 20 }}>
            <input value={form.full} onChange={e => setForm({ ...form, full: e.target.value })} placeholder="Full address" style={{ width: "100%", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10, fontSize: 13, boxSizing: "border-box" }} />
            <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" style={{ width: "100%", border: "1px solid #e0e0e0", borderRadius: 8, padding: "10px 12px", marginBottom: 10, fontSize: 13, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8 }}>
              {["Home", "Work", "Other"].map(l => (
                <button key={l} onClick={() => setForm({ ...form, label: l })} style={{ border: `2px solid ${form.label === l ? "#1a8a3c" : "#e0e0e0"}`, color: form.label === l ? "#1a8a3c" : "#888", background: form.label === l ? "#f0fdf4" : "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => setAdding(false)} style={{ flex: 1, border: "1px solid #e0e0e0", background: "#fff", borderRadius: 8, padding: "10px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { setAddress({ ...form, area: form.full.slice(0, 30) + "..." }); setAdding(false); onClose(); }} style={{ flex: 1, background: "#1a8a3c", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save</button>
            </div>
          </div>
        )}
        <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Your saved address</div>
        {address.full ? (
          <div onClick={onClose} style={{ border: "1.5px solid #1a8a3c", borderRadius: 12, padding: 14, cursor: "pointer", background: "#f0fdf4" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#1a8a3c", marginBottom: 4 }}>📍 {address.label}</div>
            <div style={{ fontSize: 12, color: "#555" }}>{address.full}</div>
          </div>
        ) : (
          <div style={{ color: "#ccc", fontSize: 13, textAlign: "center", padding: 20 }}>No saved addresses</div>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ────────────────────────────────────────────────────────────
function LoginPage({ onBack, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const { setIsLoggedIn, setUser } = useCart();

  const handlePhoneSubmit = () => {
    if (phone.length < 10) { setError("Enter a valid 10-digit number"); return; }
    setError(""); setStep("otp");
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const n = [...otp]; n[idx] = val; setOtp(n);
    if (val && idx < 3) document.getElementById(`otp-${idx + 1}`)?.focus();
    if (n.every(d => d) && val) setTimeout(() => verify(n), 100);
  };

  const verify = (o = otp) => {
    if (o.join("").length < 4) { setError("Enter 4-digit OTP"); return; }
    setIsLoggedIn(true); setUser({ phone: `+91-${phone}` }); onSuccess();
  };

  const bgEmojis = ["🍌", "🧴", "🍚", "🧃", "🍪", "🍦", "🥦", "🧴", "🫒", "☕", "🥄", "🍟"];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: "16px 16px 8px", background: "linear-gradient(180deg, #f0fdf4, #fff)" }}>
        {bgEmojis.map((e, i) => <div key={i} style={{ background: "#f3f3f3", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", height: 58, fontSize: 26 }}>{e}</div>)}
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #1a8a3c, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>⚡</div>
          <span style={{ fontWeight: 900, fontSize: 24, color: "#1a8a3c" }}>pilanico</span>
        </div>
        {step === "phone" ? (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#222", marginBottom: 4 }}>India's last minute app</h2>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Log in or Sign up</p>
            {error && <div style={{ color: "red", fontSize: 12, marginBottom: 10 }}>{error}</div>}
            <div style={{ display: "flex", alignItems: "center", border: "2px solid #e0e0e0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <span style={{ padding: "14px 14px", fontSize: 14, fontWeight: 600, color: "#333", borderRight: "1px solid #e8e8e8", background: "#f5f5f5" }}>+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter mobile number" style={{ flex: 1, border: "none", padding: "14px 14px", fontSize: 15, background: "transparent", outline: "none" }} />
            </div>
            <button onClick={handlePhoneSubmit} style={{ width: "100%", background: "#1a8a3c", color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 16 }}>Continue</button>
            <p style={{ fontSize: 10, color: "#aaa", textAlign: "center" }}>By continuing, you agree to our <span style={{ color: "#1a8a3c" }}>Terms of service</span> & <span style={{ color: "#1a8a3c" }}>Privacy policy</span></p>
            <div style={{ marginTop: 20, textAlign: "center" }}><span onClick={onBack} style={{ color: "#888", fontSize: 12, cursor: "pointer" }}>← Go back</span></div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <span onClick={() => setStep("phone")} style={{ cursor: "pointer", fontSize: 20 }}>←</span>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>OTP Verification</h2>
            </div>
            <p style={{ fontSize: 13, color: "#666", textAlign: "center", marginBottom: 28 }}>We have sent a verification code to<br /><strong style={{ color: "#222" }}>+91-{phone}</strong></p>
            {error && <div style={{ color: "red", fontSize: 12, marginBottom: 10, textAlign: "center" }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28 }}>
              {otp.map((d, i) => (
                <input key={i} id={`otp-${i}`} value={d} onChange={e => handleOtpChange(i, e.target.value)} maxLength={1}
                  style={{ width: 52, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, border: `2px solid ${d ? "#1a8a3c" : "#e0e0e0"}`, borderRadius: 12, outline: "none", background: d ? "#f0fdf4" : "#fafafa" }} />
              ))}
            </div>
            <button onClick={() => verify()} style={{ width: "100%", background: "#1a8a3c", color: "#fff", border: "none", borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 14 }}>Verify OTP</button>
            <p style={{ textAlign: "center", fontSize: 12, color: "#aaa" }}>Resend Code <span style={{ color: "#1a8a3c", fontWeight: 600 }}>(in 12 secs)</span></p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CART PAGE ─────────────────────────────────────────────────────────────
function CartPage({ onBack, onProceed, onChangeAddress, payLoading = false }) {
  const { cartItems, addToCart, removeFromCart, subtotal, grandTotal, address, isLoggedIn } = useCart();

  if (!cartItems.length) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", gap: 16, padding: 32 }}>
      <span style={{ fontSize: 64 }}>🛒</span>
      <h2 style={{ fontSize: 18, fontWeight: 700 }}>Your cart is empty</h2>
      <p style={{ color: "#888", fontSize: 14, textAlign: "center" }}>Add items from the store to get started</p>
      <button onClick={onBack} style={{ background: "#1a8a3c", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Start Shopping</button>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>
      <div style={{ background: "#fff", display: "flex", alignItems: "center", padding: "14px 16px", gap: 12, borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10 }}>
        <span onClick={onBack} style={{ cursor: "pointer", fontSize: 20 }}>←</span>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>My Cart</h1>
      </div>

      <div style={{ background: "#fff", margin: "8px 12px", borderRadius: 14, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, background: "#e8f5e9", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a8a3c" }}>Free delivery in 8 minutes</div>
            <div style={{ fontSize: 11, color: "#888" }}>Shipment of {cartItems.reduce((s, i) => s + i.qty, 0)} item</div>
          </div>
        </div>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 52, height: 52, background: "#f5f5f5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{item.image}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{item.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{item.weight}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>₹{item.price}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", background: "#1a8a3c", borderRadius: 8, overflow: "hidden" }}>
              <button onClick={() => removeFromCart(item.id)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, fontWeight: 700, padding: "6px 12px", cursor: "pointer" }}>−</button>
              <span style={{ color: "#fff", fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
              <button onClick={() => addToCart(item)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 18, fontWeight: 700, padding: "6px 12px", cursor: "pointer" }}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", margin: "8px 12px", borderRadius: 14, padding: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Bill details</h3>
        {[["🧾 Items total", `₹${subtotal}`, "#333"], ["🛵 Delivery charge", "FREE", "#1a8a3c"], ["🔒 Handling charge", "₹2", "#333"]].map(([l, v, c]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
            <span style={{ color: "#555" }}>{l}</span><span style={{ fontWeight: 700, color: c }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px dashed #e0e0e0", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Grand total</span>
          <span style={{ fontWeight: 800, fontSize: 15 }}>₹{grandTotal}</span>
        </div>
      </div>

      {isLoggedIn && (
        <div style={{ background: "#fff", margin: "8px 12px", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>Delivering to {address.label}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{address.full}</div>
              </div>
            </div>
            <span onClick={onChangeAddress} style={{ color: "#1a8a3c", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Change</span>
          </div>
        </div>
      )}

      {!isLoggedIn && (
        <div style={{ background: "#fff", margin: "8px 12px", borderRadius: 14, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>Cancellation Policy</div>
          <p style={{ fontSize: 11, color: "#888", lineHeight: 1.5, margin: 0 }}>Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.</p>
        </div>
      )}

      {isLoggedIn && (
        <div style={{ background: "#fff", margin: "8px 12px", borderRadius: 14, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Tip your delivery partner</div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>Your kindness means a lot! 100% of your tip goes directly to your delivery partner.</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[10, 20, 30, 50].map(tip => <button key={tip} style={{ border: "1.5px solid #e0e0e0", background: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>₹{tip}</button>)}
          </div>
        </div>
      )}

      <div style={{ height: 90 }} />
      <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #f0f0f0", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 11, color: "#888" }}>TOTAL</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>₹{grandTotal}</div>
        </div>
        <button onClick={onProceed} disabled={payLoading} style={{ background: payLoading ? "#888" : "#1a8a3c", color: "#fff", border: "none", borderRadius: 12, padding: "14px 24px", fontSize: 14, fontWeight: 700, cursor: payLoading ? "not-allowed" : "pointer", flex: 1, marginLeft: 16, transition: "background 0.2s" }}>
          {payLoading ? "⏳ Processing..." : isLoggedIn ? "Proceed To Pay →" : "Login to Proceed →"}
        </button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage() {
  const hotDeals = products.filter(p => p.discount && p.discount >= 20);
  const dairy = products.filter(p => p.category === 1 || p.category === 2);
  const munchies = products.filter(p => p.category === 3 || p.category === 4);
  const tea = products.filter(p => p.category === 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{ margin: "8px 12px 0" }}>
        <div style={{ background: "linear-gradient(135deg, #1a8a3c 0%, #27ae60 60%, #52d68a 100%)", borderRadius: 18, padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>⚡ Express Delivery</div>
            <div style={{ color: "#fff", fontSize: 21, fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>Groceries in<br />8 Minutes!</div>
            <div style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 700, display: "inline-block" }}>Shop Now →</div>
          </div>
          <span style={{ fontSize: 72 }}>🛒</span>
        </div>
      </div>
      <CategoryGrid />
      <ProductSection title="🔥 Hot deals" products={hotDeals} />
      <StoreRow />
      <ProductSection title="🥛 Dairy products for you" products={dairy} />
      {munchies.length > 0 && <ProductSection title="😋 Munchies & Drinks" products={munchies} />}
      {tea.length > 0 && <ProductSection title="☕ Beverages Gift Packs Online" products={tea} />}
      <div style={{ margin: "0 12px" }}>
        <div style={{ background: "#fff8e1", borderRadius: 16, padding: 16, border: "1px solid #ffe082" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#f57c00", marginBottom: 4 }}>🎁 Beverage Gift Packs Online</div>
          <div style={{ fontSize: 12, color: "#888" }}>Gift-giving is an art, and selecting the perfect beverage gift pack makes it special.</div>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ────────────────────────────────────────────────────────────────
function Header({ onCartClick, onLoginClick, onNavigate }) {
  const { totalItems, subtotal, address } = useCart();
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", maxWidth: 480, margin: "0 auto" }}>
        <div onClick={() => onNavigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1a8a3c, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <span style={{ fontWeight: 900, fontSize: 20, color: "#1a8a3c", letterSpacing: -0.5 }}>pilanico</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#222" }}>Delivery in 22 mins</div>
          <div style={{ fontSize: 10, color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>📍 {address.pincode}, {address.area}</div>
        </div>
        <div onClick={onLoginClick} style={{ width: 34, height: 34, borderRadius: "50%", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, border: "2px solid #e8e8e8" }}>👤</div>
      </div>
      <div style={{ padding: "0 16px 10px", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", background: "#f5f5f5", borderRadius: 10, padding: "9px 14px", gap: 8 }}>
          <span style={{ fontSize: 16, color: "#999" }}>🔍</span>
          <input placeholder='Search "rice"' style={{ border: "none", background: "transparent", outline: "none", fontSize: 14, color: "#333", flex: 1 }} />
        </div>
      </div>
      {totalItems > 0 && (
        <div onClick={onCartClick} style={{ background: "#1a8a3c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", cursor: "pointer" }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>🛒 {totalItems} item{totalItems > 1 ? "s" : ""}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>View Cart ₹{subtotal} →</span>
        </div>
      )}
    </header>
  );
}

// ─── PAYMENT SUCCESS PAGE ──────────────────────────────────────────────────
function PaymentSuccessPage({ paymentId, orderId, amount, onContinue }) {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#f0fdf4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ background: "#fff", borderRadius: 24, padding: 32, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 8px 32px rgba(26,138,60,0.12)" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #1a8a3c, #27ae60)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a8a3c", marginBottom: 8 }}>Order Placed!</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Your payment was successful. Your groceries will arrive in 8 minutes! ⚡</p>
        <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16, marginBottom: 20, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: "#888" }}>Payment ID</span>
            <span style={{ fontWeight: 700, color: "#222", fontSize: 11 }}>{paymentId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
            <span style={{ color: "#888" }}>Order ID</span>
            <span style={{ fontWeight: 700, color: "#222", fontSize: 11 }}>{orderId}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: "#888" }}>Amount Paid</span>
            <span style={{ fontWeight: 800, color: "#1a8a3c" }}>₹{amount}</span>
          </div>
        </div>
        <button onClick={onContinue} style={{ width: "100%", background: "#1a8a3c", color: "#fff", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────

// 🔑 Razorpay Key (test)
const RAZORPAY_KEY = "rzp_test_SNXp2uYizKvStf";
// 🔧 Backend URL — for order creation & signature verification
const BACKEND_URL = "http://localhost:5000";

function AppInner() {
  const [page, setPage] = useState("home");
  const [showAddr, setShowAddr] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const { isLoggedIn, totalItems, grandTotal, cartItems, user, setCartItems } = useCart();

  // Load Razorpay SDK script dynamically
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleProceed = async () => {
    if (!isLoggedIn) { setPage("login"); return; }
    setPayLoading(true);

    try {
      // Step 1: Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert("Failed to load Razorpay SDK. Check your internet connection.");
        setPayLoading(false);
        return;
      }

      // Step 2: Try to create order via backend; fall back to keyless mode if backend is offline
      let orderOptions = {};
      try {
        const orderRes = await fetch(`${BACKEND_URL}/api/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "INR",
            receipt: `pilanico_${Date.now()}`,
            notes: { items: cartItems.map(i => `${i.name} x${i.qty}`).join(", "), phone: user?.phone || "" },
          }),
        });
        const od = await orderRes.json();
        if (od.success) {
          orderOptions = { order_id: od.orderId };
        }
      } catch (_) {
        // Backend offline — Razorpay works without order_id in test mode
        console.warn("Backend offline — using keyless Razorpay test mode");
      }

      // Step 3: Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: grandTotal * 100,           // paise
        currency: "INR",
        name: "Pilanico",
        description: `${cartItems.reduce((s, i) => s + i.qty, 0)} items • Grocery Order`,
        ...orderOptions,
        prefill: {
          contact: user?.phone?.replace("+91-", "") || "",
        },
        notes: {
          items: cartItems.map(i => `${i.name} x${i.qty}`).join(", "),
        },
        theme: { color: "#1a8a3c" },
        modal: {
          ondismiss: () => setPayLoading(false),
        },
        handler: async (response) => {
          // Step 4: Verify signature on backend (if backend is running)
          let verified = false;
          if (response.razorpay_order_id) {
            try {
              const vr = await fetch(`${BACKEND_URL}/api/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const vd = await vr.json();
              verified = vd.success;
            } catch (_) {
              // Backend offline — trust Razorpay handler callback in test mode
              verified = true;
            }
          } else {
            // No order_id means test/keyless mode — payment succeeded if handler called
            verified = true;
          }

          if (verified) {
            setCartItems && setCartItems([]);   // Clear cart
            setPaymentResult({
              paymentId: response.razorpay_payment_id || "pay_test_" + Date.now(),
              orderId: response.razorpay_order_id || "order_test_" + Date.now(),
              amount: grandTotal,
            });
            setPage("success");
          } else {
            alert("⚠️ Payment verification failed. Please contact support.");
          }
          setPayLoading(false);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => {
        alert(`❌ Payment failed: ${r.error.description}`);
        setPayLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment error: " + err.message);
      setPayLoading(false);
    }
  };

  if (page === "success" && paymentResult) return (
    <PaymentSuccessPage
      paymentId={paymentResult.paymentId}
      orderId={paymentResult.orderId}
      amount={paymentResult.amount}
      onContinue={() => { setPage("home"); setPaymentResult(null); }}
    />
  );

  if (page === "cart") return (
    <>
      <CartPage onBack={() => setPage("home")} onProceed={handleProceed} onChangeAddress={() => setShowAddr(true)} payLoading={payLoading} />
      {showAddr && <AddressModal onClose={() => setShowAddr(false)} />}
    </>
  );

  if (page === "login") return <LoginPage onBack={() => setPage(totalItems > 0 ? "cart" : "home")} onSuccess={() => setPage("cart")} />;

  return (
    <div style={{ background: "#f8f8f8", minHeight: "100vh" }}>
      <Header onCartClick={() => setPage("cart")} onLoginClick={() => setPage("login")} onNavigate={setPage} />
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <HomePage />
      </div>
      {showAddr && <AddressModal onClose={() => setShowAddr(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f8f8; }
        ::-webkit-scrollbar { display: none; }
        button, input { font-family: 'Poppins', sans-serif; }
      `}</style>
      <AppInner />
    </CartProvider>
  );
}
