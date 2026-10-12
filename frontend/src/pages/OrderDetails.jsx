import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import "./../shopkart.css";

function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${orderId}`);
                setOrder(response.data.order);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate("/login");
                    return;
                }
                setError(
                    err.response?.data?.message ||
                    "Unable to load order details."
                );
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId, navigate]);

    const statusColor = (status) => {
        if (status === "PLACED" || status === "CONFIRMED") return { bg: "#052e16", border: "#16a34a", text: "#86efac" };
        if (status === "SHIPPED") return { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" };
        if (status === "DELIVERED") return { bg: "#1e1b4b", border: "#8b5cf6", text: "#c4b5fd" };
        return { bg: "#1c1917", border: "#78716c", text: "#d6d3d1" };
    };

    const paymentColor = (status) => {
        if (status === "PAID") return { bg: "#052e16", border: "#16a34a", text: "#86efac" };
        if (status === "FAILED") return { bg: "#3b1025", border: "#e45b87", text: "#f9a8c9" };
        return { bg: "#1c1917", border: "#78716c", text: "#d6d3d1" };
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
                    <Link to="/my-orders">My Orders</Link>
                </nav>
                <Link className="header-login" to="/account">
                    My Account
                </Link>
            </header>

            <main className="products-page">
                <section className="products-heading">
                    <span>📦 ORDER DETAILS</span>
                    <h1>Order <span>Receipt.</span></h1>
                    <p>Full details for this order.</p>
                </section>

                {loading && (
                    <p style={{ color: "#9da4c7" }}>Loading order...</p>
                )}

                {!loading && error && (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <p style={{ color: "#f87171" }}>{error}</p>
                        <Link to="/my-orders" style={{ color: "#a78bfa" }}>
                            ← Back to My Orders
                        </Link>
                    </div>
                )}

                {!loading && order && (
                    <div style={{ maxWidth: "720px" }}>

                        {/* Header row */}
                        <div className="product-card" style={{ padding: "28px", marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                                <div>
                                    <p style={{ color: "#9da4c7", fontSize: "12px", margin: "0 0 4px", fontWeight: 700, letterSpacing: "1px" }}>
                                        ORDER ID
                                    </p>
                                    <p style={{ color: "#f8fafc", margin: 0, fontSize: "13px", fontFamily: "monospace" }}>
                                        #{order._id}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ color: "#9da4c7", fontSize: "12px", margin: "0 0 4px", fontWeight: 700, letterSpacing: "1px" }}>
                                        ORDER DATE
                                    </p>
                                    <p style={{ color: "#f8fafc", margin: 0, fontSize: "13px" }}>
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Status badges */}
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                {(() => {
                                    const c = paymentColor(order.paymentStatus);
                                    return (
                                        <span style={{
                                            padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                                            fontWeight: 700, background: c.bg, border: `1px solid ${c.border}`, color: c.text
                                        }}>
                                            💳 Payment: {order.paymentStatus}
                                        </span>
                                    );
                                })()}
                                {(() => {
                                    const c = statusColor(order.status);
                                    return (
                                        <span style={{
                                            padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                                            fontWeight: 700, background: c.bg, border: `1px solid ${c.border}`, color: c.text
                                        }}>
                                            📦 Status: {order.status}
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="product-card" style={{ padding: "28px", marginBottom: "20px" }}>
                            <h3 style={{ color: "#c4b5fd", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 18px" }}>
                                ITEMS
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "14px 16px", background: "#0f142b", borderRadius: "10px",
                                        border: "1px solid #1e2545"
                                    }}>
                                        <div>
                                            <div style={{ color: "#f8fafc", fontWeight: 600, fontSize: "14px" }}>
                                                {item.name}
                                            </div>
                                            <div style={{ color: "#9da4c7", fontSize: "12px", marginTop: "4px" }}>
                                                ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ color: "#c084fc", fontWeight: 700, fontSize: "15px" }}>
                                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: "1px solid #30365b", paddingTop: "18px", marginTop: "18px", display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>Total</span>
                                <span style={{ fontSize: "22px", fontWeight: 800, color: "#c084fc" }}>
                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                </span>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="product-card" style={{ padding: "28px", marginBottom: "28px" }}>
                            <h3 style={{ color: "#c4b5fd", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 14px" }}>
                                DELIVERY ADDRESS
                            </h3>
                            <div style={{ color: "#cbd5e1", lineHeight: "1.9", fontSize: "14px" }}>
                                <strong style={{ color: "#f8fafc" }}>{order.shippingAddress.fullName}</strong><br />
                                {order.shippingAddress.phone}<br />
                                {order.shippingAddress.addressLine1}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                            </div>
                        </div>

                        <Link to="/my-orders" style={{
                            display: "inline-block",
                            padding: "13px 26px",
                            borderRadius: "10px",
                            background: "linear-gradient(100deg, #6366f1, #c026d3)",
                            color: "white",
                            fontWeight: 700,
                            textDecoration: "none",
                            fontSize: "14px"
                        }}>
                            ← Back to My Orders
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default OrderDetails;
