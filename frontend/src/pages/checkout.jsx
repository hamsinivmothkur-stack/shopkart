import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useCart } from "../CartContext";
import "./../shopkart.css";

function Checkout() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [shipping, setShipping] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [placing, setPlacing] = useState(false);

    const subtotal = cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const handleChange = (field, value) => {
        setShipping(prev => ({ ...prev, [field]: value }));
        // Clear error on edit
        if (fieldErrors[field]) {
            setFieldErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validate = () => {
        const errors = {};

        if (!shipping.fullName.trim())
            errors.fullName = "Full name is required.";

        if (!shipping.phone.trim())
            errors.phone = "Phone number is required.";
        else if (!/^[0-9]{10}$/.test(shipping.phone.trim()))
            errors.phone = "Phone must be a 10-digit number.";

        if (!shipping.addressLine1.trim())
            errors.addressLine1 = "Address is required.";

        if (!shipping.city.trim())
            errors.city = "City is required.";

        if (!shipping.state.trim())
            errors.state = "State is required.";

        if (!shipping.pincode.trim())
            errors.pincode = "Pincode is required.";
        else if (!/^[0-9]{6}$/.test(shipping.pincode.trim()))
            errors.pincode = "Pincode must contain 6 digits.";

        return errors;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setFormError("");

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (cart.length === 0) {
            setFormError("Your cart is empty. Add items before checking out.");
            return;
        }

        setPlacing(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/orders/create-payment-order",
                { shippingAddress: shipping },
                { withCredentials: true }
            );

            const {
                razorpayOrderId,
                amount,
                currency,
                keyId,
                orderId
            } = response.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "ShopKart",
                description: "Order payment",
                order_id: razorpayOrderId,

                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await axios.post(
                            "http://localhost:3000/orders/verify-payment",
                            {
                                orderId,
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature
                            },
                            { withCredentials: true }
                        );

                        if (verifyResponse.data.success) {
                            clearCart();
                            navigate(`/order-confirmation/${verifyResponse.data.orderId}`);
                        }
                    } catch (err) {
                        const msg =
                            err.response?.data?.message ||
                            "Payment verification failed. Please contact support.";
                        setFormError(msg);
                        setPlacing(false);
                    }
                },

                modal: {
                    ondismiss: function () {
                        setFormError("Payment was cancelled. Your cart is still saved.");
                        setPlacing(false);
                    }
                },

                prefill: {
                    name: shipping.fullName,
                    contact: shipping.phone
                },

                theme: { color: "#6366f1" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                "Unable to create order. Please try again.";
            setFormError(msg);
            setPlacing(false);
        }
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
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/cart">Cart</Link>
                </nav>
                <Link className="header-login" to="/account">
                    My Account
                </Link>
            </header>

            <main className="products-page">
                <section className="products-heading">
                    <span>🛍️ CHECKOUT</span>
                    <h1>Complete your<br /><span>order.</span></h1>
                    <p>Enter your delivery details below.</p>
                </section>

                <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>

                    {/* ── Shipping Form ── */}
                    <div className="product-card" style={{ padding: "30px" }}>
                        <h2 style={{ marginTop: 0 }}>Shipping Details</h2>

                        {formError && (
                            <div style={{
                                background: "#3b1025",
                                border: "1px solid #e45b87",
                                borderRadius: "10px",
                                padding: "14px 18px",
                                marginBottom: "20px",
                                color: "#f9a8c9",
                                fontSize: "14px"
                            }}>
                                ⚠️ {formError}
                            </div>
                        )}

                        <form onSubmit={handlePlaceOrder}
                            style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                            {[
                                { key: "fullName", label: "Full Name", placeholder: "Aarav Sharma" },
                                { key: "phone", label: "Phone Number", placeholder: "9876543210" },
                                { key: "addressLine1", label: "Address", placeholder: "22 MG Road" },
                                { key: "city", label: "City", placeholder: "Bengaluru" },
                                { key: "state", label: "State", placeholder: "Karnataka" },
                                { key: "pincode", label: "Pincode", placeholder: "560001" }
                            ].map(({ key, label, placeholder }) => (
                                <div key={key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", color: "#a78bfa", fontWeight: 600 }}>
                                        {label}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={placeholder}
                                        value={shipping[key]}
                                        onChange={e => handleChange(key, e.target.value)}
                                        style={{
                                            padding: "13px 15px",
                                            borderRadius: "10px",
                                            border: fieldErrors[key]
                                                ? "1px solid #e45b87"
                                                : "1px solid #354064",
                                            background: "#1a203e",
                                            color: "white",
                                            fontSize: "15px",
                                            outline: "none",
                                            font: "inherit",
                                            boxSizing: "border-box",
                                            width: "100%"
                                        }}
                                    />
                                    {fieldErrors[key] && (
                                        <span style={{ color: "#f87171", fontSize: "12px" }}>
                                            {fieldErrors[key]}
                                        </span>
                                    )}
                                </div>
                            ))}

                            <button
                                type="submit"
                                disabled={placing}
                                style={{
                                    padding: "15px",
                                    border: 0,
                                    borderRadius: "12px",
                                    background: placing
                                        ? "#374151"
                                        : "linear-gradient(100deg, #6366f1, #c026d3, #f97316)",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    cursor: placing ? "not-allowed" : "pointer",
                                    marginTop: "8px",
                                    transition: "transform 0.2s"
                                }}
                            >
                                {placing ? "Opening Payment..." : "Continue to Payment →"}
                            </button>
                        </form>
                    </div>

                    {/* ── Order Summary ── */}
                    <div className="product-card" style={{ padding: "30px" }}>
                        <h2 style={{ marginTop: 0 }}>Order Summary</h2>

                        {cart.length === 0 ? (
                            <div>
                                <p style={{ color: "#9da4c7" }}>Your cart is empty.</p>
                                <Link to="/products" style={{ color: "#a78bfa" }}>
                                    Browse Products →
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                                    {cart.map(item => (
                                        <div key={item.product._id}
                                            style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px" }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "14px", fontWeight: 600, color: "#f8fafc", marginBottom: "4px" }}>
                                                    {item.product.name}
                                                </div>
                                                <div style={{ fontSize: "13px", color: "#9da4c7" }}>
                                                    Qty: {item.quantity}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: "15px", fontWeight: 700, color: "#c084fc", whiteSpace: "nowrap" }}>
                                                ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    borderTop: "1px solid #30365b",
                                    paddingTop: "20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <span style={{ fontSize: "18px", fontWeight: 700, color: "#f8fafc" }}>
                                        Total
                                    </span>
                                    <span style={{ fontSize: "22px", fontWeight: 800, color: "#c084fc" }}>
                                        ₹{subtotal.toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "14px" }}>
                                    * Final price is calculated server-side. Test card: 4111 1111 1111 1111
                                </p>
                            </>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Checkout;