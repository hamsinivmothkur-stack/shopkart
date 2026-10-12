
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../CartContext";
import "../shopkart.css";

function Home() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const { cart, cartCount } = useCart();

  useEffect(() => {
    async function getCustomer() {
      try {
        const response = await axios.get(
          "http://localhost:3000/customers/me",
          { withCredentials: true }
        );
        setCustomer(response.data.customer || response.data);
      } catch (error) {
        navigate("/login");
      }
    }
    getCustomer();
  }, [navigate]);


  async function handleLogout() {
    try {
      await axios.post(
        "http://localhost:3000/customers/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );



  return (
    <div className="shopkart-page">
      <header className="shopkart-header">
        <div className="brand">🛒 Shop<span>Kart</span></div>

        <nav>
          <a href="#home">Home</a>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart {cartCount > 0 && <span style={{
            background: "linear-gradient(100deg,#6366f1,#c026d3)",
            borderRadius: "10px", padding: "1px 7px",
            fontSize: "11px", fontWeight: 700, color: "white", marginLeft: "4px"
          }}>{cartCount}</span>}</Link>
          <Link to="/my-orders">My Orders</Link>
          <a href="#deals">Deals</a>
        </nav>

        <button className="header-login logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="home-content" id="home">

        {customer && (
          <h2 className="welcome-message">
            Welcome back, {customer.name || customer.fullName}! 💗
          </h2>
        )}

        {/* ── Hero ── */}
        <section className="home-hero">
          <span className="hero-badge">✨ YOUR NEXT FAVOURITE THING</span>
          <h1>Shopping made<br /><span>more exciting.</span></h1>
          <p>
            Discover your favourites, explore new finds,
            and enjoy a shopping experience made for you.
          </p>
          <Link className="shop-button" to="/products">
            Explore Products →
          </Link>
          <div className="home-emoji">🛍️ 🎧 👟 🎁</div>
        </section>

        {/* ── Quick Actions ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", margin: "30px 0", maxWidth: "520px" }}>

          {/* Cart Card */}
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "28px 26px",
              borderRadius: "20px",
              background: "linear-gradient(145deg, #1a1f3e, #0f1428)",
              border: "1px solid #30365b",
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s",
              display: "flex",
              gap: "20px",
              alignItems: "center"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "#6366f1"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";   e.currentTarget.style.borderColor = "#30365b"; }}
            >
              <div style={{
                width: "56px", height: "56px", borderRadius: "14px", flexShrink: 0,
                background: "linear-gradient(135deg,#6366f1,#c026d3)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px"
              }}>🛒</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "17px" }}>My Cart</h3>
                  {cartCount > 0 && (
                    <span style={{
                      background: "linear-gradient(100deg,#6366f1,#c026d3)",
                      borderRadius: "12px", padding: "3px 10px",
                      fontSize: "12px", fontWeight: 700, color: "white"
                    }}>
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </span>
                  )}
                </div>
                {cartCount === 0 ? (
                  <p style={{ margin: 0, color: "#9da4c7", fontSize: "13px" }}>Your cart is empty.</p>
                ) : (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "8px" }}>
                      {cart.slice(0, 2).map(item => (
                        <p key={item.product._id} style={{ margin: 0, color: "#cbd5e1", fontSize: "12px" }}>
                          {item.product.name} × {item.quantity}
                        </p>
                      ))}
                      {cart.length > 2 && (
                        <p style={{ margin: 0, color: "#9da4c7", fontSize: "12px" }}>
                          +{cart.length - 2} more item{cart.length - 2 > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <p style={{ margin: 0, color: "#c084fc", fontWeight: 700, fontSize: "15px" }}>
                      ₹{cartSubtotal.toLocaleString("en-IN")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </Link>

        </section>

        {/* ── Benefits ── */}
        <section className="home-benefits" id="products">
          <div className="home-benefit">
            <span>🚚</span>
            <h3>Fast Delivery</h3>
            <p>Your favourites, delivered to your doorstep.</p>
          </div>
          <div className="home-benefit">
            <span>💎</span>
            <h3>Great Finds</h3>
            <p>Discover something new every day.</p>
          </div>
          <div className="home-benefit">
            <span>🔒</span>
            <h3>Secure Shopping</h3>
            <p>Your account matters to us.</p>
          </div>
          <div className="home-benefit" id="deals">
            <span>🎉</span>
            <h3>Special Deals</h3>
            <p>Find exciting offers for your next purchase.</p>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Home;