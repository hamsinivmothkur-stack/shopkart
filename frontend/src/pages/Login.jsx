
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../shopkart.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/customers/login",
        { email, password },
        { withCredentials: true }
      );

      setMessage(response.data.message || "Login successful!");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setMessage(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        setMessage("Cannot connect to the backend. Please check the server.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shopkart-page">
      <header className="shopkart-header">
        <Link className="brand" to="/register">
          🛒 Shop<span>Kart</span>
        </Link>

        <nav>
          <Link to="/home">Home</Link>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
        </nav>

        <Link className="header-login" to="/register">
          Register
        </Link>
      </header>

      <main className="register-layout">
        <section className="shop-intro">
          <h1>Welcome <span>Back!</span></h1>
          <h2>Your favourite shopping experience awaits 💗</h2>

          <div className="benefits">
            <div>🚚 <b>Fast Delivery</b><small>At your doorstep</small></div>
            <div>🛡️ <b>Secure Shopping</b><small>Your account, protected</small></div>
            <div>⭐ <b>Special Offers</b><small>Discover more savings</small></div>
            <div>💖 <b>Happy Shopping</b><small>Find things you love</small></div>
          </div>

          <div className="shopping-art">🛍️ 🛒 🎁</div>
        </section>

        <section className="register-card">
          <div className="bag-icon">🔐</div>
          <h2>Login to ShopKart</h2>
          <p className="subtitle">Good to have you back! ✨</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          {message && <p role="status">{message}</p>}

          <p className="login-prompt">
            New to ShopKart? <Link to="/register">Create an account</Link>
          </p>
        </section>

        <aside className="shopping-message">
          <h2>
            Shop More<br />
            <span>Smile More</span>
          </h2>
          <div className="smile">😊</div>
        </aside>
      </main>
    </div>
  );
}

export default Login;