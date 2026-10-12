import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./../shopkart.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/orders",
                    { withCredentials: true }
                );
                setOrders(response.data.orders || []);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                    return;
                }
                setError(
                    err.response?.data?.message ||
                    "Unable to load your orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const paymentBadge = (status) => {
        const styles = {
            PAID:    { bg: "#052e16", border: "#16a34a", text: "#86efac" },
            FAILED:  { bg: "#3b1025", border: "#e45b87", text: "#f9a8c9" },
            PENDING: { bg: "#1c1917", border: "#78716c", text: "#d6d3d1" }
        };
        const s = styles[status] || styles.PENDING;
        return (
            <span style={{
                padding: "4px 11px", borderRadius: "14px", fontSize: "11px",
                fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.text
            }}>
                {status}
            </span>
        );
    };

    const statusBadge = (status) => {
        const styles = {
            PLACED:          { bg: "#052e16",  border: "#16a34a", text: "#86efac" },
            CONFIRMED:       { bg: "#052e16",  border: "#16a34a", text: "#86efac" },
            SHIPPED:         { bg: "#1e3a5f",  border: "#3b82f6", text: "#93c5fd" },
            DELIVERED:       { bg: "#1e1b4b",  border: "#8b5cf6", text: "#c4b5fd" },
            PENDING_PAYMENT: { bg: "#1c1917",  border: "#78716c", text: "#d6d3d1" }
        };
        const s = styles[status] || styles.PENDING_PAYMENT;
        return (
            <span style={{
                padding: "4px 11px", borderRadius: "14px", fontSize: "11px",
                fontWeight: 700, background: s.bg, border: `1px solid ${s.border}`, color: s.text
            }}>
                {status}
            </span>
        );
    };

    return (
        <div className="shopkart-page">
            <header className="shopkart-header">
                <Link className="brand" to="/home">
                    🛒 Shop<span>Kart</span>
                </Link>
                <nav>
                    <Link to="/home">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                </nav>
                <Link className="header-login" to="/account">
                    My Account
                </Link>
            </header>

            <main className="products-page">
                <section className="products-heading">
                    <span>📦 YOUR ORDERS</span>
                    <h1>My <span>Orders.</span></h1>
                    <p>View your order history and payment status.</p>
                </section>

                {loading && (
                    <div style={{ padding: "40px 0" }}>
                        <p style={{ color: "#9da4c7", fontSize: "16px" }}>Loading your orders...</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{
                        background: "#1c1917", border: "1px solid #78716c",
                        borderRadius: "16px", padding: "32px", textAlign: "center"
                    }}>
                        <p style={{ fontSize: "36px", margin: "0 0 12px" }}>😕</p>
                        <p style={{ color: "#f87171", margin: "0 0 16px" }}>{error}</p>
                        <Link to="/login" style={{ color: "#a78bfa", fontWeight: 600 }}>
                            Please log in →
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div style={{
                        background: "linear-gradient(145deg, #171c38, #10152d)",
                        border: "1px solid #30365b",
                        borderRadius: "20px",
                        padding: "60px 40px",
                        textAlign: "center"
                    }}>
                        <p style={{ fontSize: "56px", margin: "0 0 16px" }}>🛍️</p>
                        <h2 style={{ color: "#f8fafc", margin: "0 0 12px" }}>No orders yet</h2>
                        <p style={{ color: "#9da4c7", margin: "0 0 24px" }}>
                            Your orders will appear here after checkout.
                        </p>
                        <Link to="/products" style={{
                            display: "inline-block", padding: "13px 28px", borderRadius: "10px",
                            background: "linear-gradient(100deg, #6366f1, #c026d3)",
                            color: "white", fontWeight: 700, textDecoration: "none", fontSize: "14px"
                        }}>
                            Explore Products →
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {orders.map((order) => (
                            <div key={order._id} className="product-card" style={{ padding: "26px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "14px" }}>

                                    <div>
                                        <p style={{ color: "#9da4c7", fontSize: "12px", margin: "0 0 4px", fontWeight: 700, letterSpacing: "1px" }}>
                                            ORDER
                                        </p>
                                        <p style={{ color: "#f8fafc", fontWeight: 700, margin: "0 0 10px", fontFamily: "monospace", fontSize: "13px" }}>
                                            #{order._id.slice(-10)}
                                        </p>
                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                            {paymentBadge(order.paymentStatus)}
                                            {statusBadge(order.status)}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <p style={{ color: "#9da4c7", fontSize: "12px", margin: "0 0 4px" }}>
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                year: "numeric", month: "short", day: "numeric"
                                            })}
                                        </p>
                                        <p style={{ color: "#c084fc", fontWeight: 800, fontSize: "22px", margin: "0 0 12px" }}>
                                            ₹{order.totalAmount.toLocaleString("en-IN")}
                                        </p>
                                        <Link to={`/order-details/${order._id}`} style={{
                                            display: "inline-block", padding: "9px 18px",
                                            borderRadius: "9px", border: "1px solid #6366f1",
                                            color: "#a5b4fc", fontWeight: 600, textDecoration: "none",
                                            fontSize: "13px"
                                        }}>
                                            View Details →
                                        </Link>
                                    </div>
                                </div>

                                {/* Item preview */}
                                <div style={{
                                    borderTop: "1px solid #1e2545", marginTop: "18px",
                                    paddingTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap"
                                }}>
                                    {order.items.map((item, idx) => (
                                        <span key={idx} style={{
                                            padding: "5px 12px", borderRadius: "20px",
                                            background: "#0f142b", border: "1px solid #1e2545",
                                            color: "#cbd5e1", fontSize: "12px"
                                        }}>
                                            {item.name} × {item.quantity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyOrders;
