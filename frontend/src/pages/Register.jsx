
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../shopkart.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/customers/register",
        {
          fullName: fullName,
          email: email,
          password: password,
          phone: phone,
        }
      );

      setMessage(
        response.data.message || "Registration successful! Please log in."
      );
    } catch (error) {
  console.error("Registration error:", error);

  if (error.response) {
    setMessage(
      `Error ${error.response.status}: ${
        error.response.data.message || "Registration failed"
      }`
    );
  } else {
    setMessage(
      "Cannot connect to the backend. Check whether the server is running."
    );
  }
}  
     finally {
      setLoading(false);
    }
  }

  return (
    <div className="shopkart-page">
      <header className="shopkart-header">
        <div className="brand">
          🛒 Shop<span>Kart</span>
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
        </nav>

        <Link className="header-login" to="/login">
          Login
        </Link>
      </header>

      <main className="register-layout">
        <section className="shop-intro">
          <h1>Shop<span>Kart</span></h1>
          <h2>Your one-stop shop for everything you love 💗</h2>

          <div className="benefits">
            <div>🚚 <b>Fast Delivery</b><small>At your doorstep</small></div>
            <div>🛡️ <b>Secure Payments</b><small>Shop with confidence</small></div>
            <div>⭐ <b>Best Offers</b><small>Save more always</small></div>
            <div>💖 <b>Happy Customers</b><small>Thousands trust us</small></div>
          </div>

          <div className="shopping-art">🛍️ 🛒 🎁</div>
        </section>

        <section className="register-card">
          <div className="bag-icon">🛍️</div>
          <h2>Create your ShopKart account</h2>
          <p className="subtitle">
            Join us and start shopping today ✨
          </p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
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

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register →"}
            </button>
          </form>

          {message && <p role="status">{message}</p>}

          <p className="login-prompt">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </section>

        <aside className="shopping-message">
          <h2>
            Better<br />
            Shopping<br />
            <span>Bigger Smiles</span>
          </h2>
          <div className="smile">😊</div>
        </aside>
      </main>
    </div>
  );
}

export default Register;