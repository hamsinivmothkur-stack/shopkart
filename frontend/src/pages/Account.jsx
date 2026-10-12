import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../shopkart.css";

function Account() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          "http://localhost:3000/customers/me",
          {
            withCredentials: true,
          }
        );

        setUser(response.data.customer);
      } catch (error) {
        setError("Unable to load account details");
      }
    }

    getUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading account...</p>;
  }

  return (
    <div className="shopkart-page">
      <header className="shopkart-header">
        <Link className="brand" to="/home">
          🛒 Shop<span>Kart</span>
        </Link>

        <nav>
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <a href="#deals">Deals</a>
        </nav>
      </header>

      <main className="account-page">
        <div className="account-heading">
          <span>👤 YOUR ACCOUNT</span>
          <h1>My Account</h1>
        </div>

        <div className="account-card">
          <h2>Account Details</h2>

          <div
            style={{
              background: "#0f142b",
              border: "1px solid #30365b",
              borderRadius: "12px",
              padding: "18px 20px",
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                color: "#9da4c7",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Full Name
            </label>

            <div style={{ color: "white", fontSize: "17px" }}>
              {user.fullName}
            </div>
          </div>

          <div
            style={{
              background: "#0f142b",
              border: "1px solid #30365b",
              borderRadius: "12px",
              padding: "18px 20px",
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                color: "#9da4c7",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>

            <div style={{ color: "white", fontSize: "17px" }}>
              {user.email}
            </div>
          </div>

          <div
            style={{
              background: "#0f142b",
              border: "1px solid #30365b",
              borderRadius: "12px",
              padding: "18px 20px",
              marginBottom: "18px",
            }}
          >
            <label
              style={{
                display: "block",
                color: "#9da4c7",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              Phone Number
            </label>

            <div style={{ color: "white", fontSize: "17px" }}>
              {user.phone}
            </div>
          </div>
        </div>

        <Link className="account-back" to="/products">
          ← Back to Products
        </Link>
      </main>
    </div>
  );
}

export default Account;