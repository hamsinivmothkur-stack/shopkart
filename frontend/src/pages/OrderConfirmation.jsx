import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./../shopkart.css";

function OrderConfirmation() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/orders/${orderId}`,
                    { withCredentials: true }
                );
                setOrder(response.data.order);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load order details."
                );
            } finally {
                setLoading(false);
            }
        };

        if (orderId) fetchOrder();
    }, [orderId]);

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
                {loading && (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <p style={{ color: "#9da4c7", fontSize: "16px" }}>Loading your order...</p>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                        <p style={{ fontSize: "40px" }}>😕</p>
                        <p style={{ color: "#f87171" }}>{error}</p>
                        <Link to="/my-orders" style={{ color: "#a78bfa" }}>
                            Go to My Orders →
                        </Link>
                    </div>
                )}

                {!loading && order && (
                    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                        {/* Success Banner */}
                        <div style={{
                            background: "linear-gradient(135deg, #052e16, #14532d)",
                            border: "1px solid #16a34a",
                            borderRadius: "20px",
                            padding: "40px",
                            textAlign: "center",
                            marginBottom: "30px"
                        }}>
                            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🎉</div>
                            <h1 style={{
                                margin: "0 0 12px",
                                fontSize: "30px",
                                color: "#86efac"
                            }}>
                                Order Placed Successfully!
                            </h1>
                            <p style={{ color: "#bbf7d0", margin: 0, fontSize: "15px" }}>
                                Your payment has been verified and your order is confirmed.
                            </p>
                        </div>

                        {/* Order Details Card */}
                        <div className="product-card" style={{ padding: "30px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                    <p style={{ color: "#9da4c7", fontSize: "13px", margin: "0 0 4px" }}>ORDER ID</p>
                                    <p style={{ color: "#f8fafc", fontWeight: 700, margin: 0, fontFamily: "monospace", fontSize: "13px" }}>
                                        #{order._id}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ color: "#9da4c7", fontSize: "13px", margin: "0 0 4px" }}>ORDER DATE</p>
                                    <p style={{ color: "#f8fafc", fontWeight: 700, margin: 0, fontSize: "13px" }}>
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
                                <span style={{
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    background: order.paymentStatus === "PAID" ? "#052e16" : "#3b1025",
                                    border: `1px solid ${order.paymentStatus === "PAID" ? "#16a34a" : "#e45b87"}`,
                                    color: order.paymentStatus === "PAID" ? "#86efac" : "#f9a8c9"
                                }}>
                                    💳 {order.paymentStatus}
                                </span>
                                <span style={{
                                    padding: "6px 14px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    background: "#1e1b4b",
                                    border: "1px solid #6366f1",
                                    color: "#a5b4fc"
                                }}>
                                    📦 {order.status}
                                </span>
                            </div>

                            {/* Items */}
                            <h3 style={{ color: "#c4b5fd", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 16px" }}>
                                ITEMS ORDERED
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "14px 16px",
                                        background: "#0f142b",
                                        borderRadius: "10px",
                                        border: "1px solid #1e2545"
                                    }}>
                                        <div>
                                            <div style={{ color: "#f8fafc", fontWeight: 600, fontSize: "14px" }}>{item.name}</div>
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

                            {/* Total */}
                            <div style={{
                                borderTop: "1px solid #30365b",
                                paddingTop: "18px",
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "28px"
                            }}>
                                <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>Total Paid</span>
                                <span style={{ fontSize: "22px", fontWeight: 800, color: "#c084fc" }}>
                                    ₹{order.totalAmount.toLocaleString("en-IN")}
                                </span>
                            </div>

                            {/* Shipping Address */}
                            <h3 style={{ color: "#c4b5fd", fontSize: "13px", fontWeight: 700, letterSpacing: "1px", margin: "0 0 14px" }}>
                                DELIVERY ADDRESS
                            </h3>
                            <div style={{
                                background: "#0f142b",
                                borderRadius: "10px",
                                border: "1px solid #1e2545",
                                padding: "16px",
                                color: "#cbd5e1",
                                lineHeight: "1.8",
                                fontSize: "14px",
                                marginBottom: "28px"
                            }}>
                                <strong style={{ color: "#f8fafc" }}>{order.shippingAddress.fullName}</strong><br />
                                {order.shippingAddress.phone}<br />
                                {order.shippingAddress.addressLine1}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                            </div>

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                                <Link to="/my-orders" style={{
                                    flex: 1,
                                    display: "block",
                                    textAlign: "center",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    background: "linear-gradient(100deg, #6366f1, #c026d3)",
                                    color: "white",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    fontSize: "14px"
                                }}>
                                    View All Orders →
                                </Link>
                                <Link to="/products" style={{
                                    flex: 1,
                                    display: "block",
                                    textAlign: "center",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #6366f1",
                                    color: "#a5b4fc",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    fontSize: "14px"
                                }}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default OrderConfirmation;
