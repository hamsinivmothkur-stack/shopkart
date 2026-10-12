import { Link } from "react-router-dom";
import { useCart } from "../CartContext";
import api from "../api";
import "./../shopkart.css";

function Cart() {
    const { cart, loading, error, fetchCart } = useCart();

    const updateQuantity = async (productId, quantity) => {
        try {
            await api.patch(`/cart/${productId}`, {
                quantity: quantity
            });

            await fetchCart();
        } catch (error) {
            console.log("Unable to update quantity");
        }
    };

    const removeProduct = async (productId) => {
        try {
            await api.delete(`/cart/${productId}`);

            await fetchCart();
        } catch (error) {
            console.log("Unable to remove product");
        }
    };

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    if (loading) {
    return <p>Loading cart...</p>;
}

if (error) {
    return <p>{error}</p>;
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
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/my-orders">My Orders</Link>
                </nav>

                <Link className="header-login" to="/account">
                    My Account
                </Link>
            </header>

            <main className="products-page">

                <section className="products-heading">
                    <span>🛒 YOUR SHOPPING CART</span>

                    <h1>
                        My
                        <br />
                        <span>Cart.</span>
                    </h1>

                    <p>
                        Products you want to buy.
                    </p>
                </section>

                {cart.length === 0 ? (
                    <div>
                        <h2>Your cart is empty.</h2>

                        <p>
                            Add products to your cart to see them here.
                        </p>

                        <Link to="/products">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <section
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr",
                            gap: "30px"
                        }}
                    >

                        <div>
                            {cart.map((item) => (
                                <div
                                    key={item.product._id}
                                    className="product-card"
                                    style={{
                                        display: "flex",
                                        gap: "20px",
                                        marginBottom: "20px",
                                        padding: "20px"
                                    }}
                                >

                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        style={{
                                            width: "180px",
                                            height: "180px",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <div>
                                        <h2>
                                            {item.product.name}
                                        </h2>

                                        <p>
                                            ₹{item.product.price}
                                        </p>

                                        <p>
                                            {item.product.category}
                                        </p>

                                        <p>
                                            Stock: {item.product.stock}
                                        </p>

                                        <div>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                            >
                                                −
                                            </button>

                                            <span
                                                style={{
                                                    margin: "0 15px"
                                                }}
                                            >
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product._id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.product.stock
                                                }
                                            >
                                                +
                                            </button>
                                        </div>

                                        <br />

                                        <button
                                            onClick={() =>
                                                removeProduct(
                                                    item.product._id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div
                            className="product-card"
                            style={{
                                padding: "25px",
                                height: "fit-content"
                            }}
                        >
                            <h2>Cart Summary</h2>

                            <p>
                                Subtotal: ₹{subtotal}
                            </p>

                            <Link to="/checkout">
                                <button> Proceed to Checkout</button>
                            </Link>
                        </div>

                    </section>
                )}

            </main>
        </div>
    );
}

export default Cart;