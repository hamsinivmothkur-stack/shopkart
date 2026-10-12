import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./shopkart.css";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:3000/wishlist",
                {
                    withCredentials: true
                }
            );

            setWishlist(response.data.wishlist);
        } catch (error) {
            setError("Unable to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeProduct = async (productId) => {
        try {
            await axios.delete(
                `http://localhost:3000/wishlist/${productId}`,
                {
                    withCredentials: true
                }
            );

            setWishlist(
                wishlist.filter((product) => product._id !== productId)
            );
        } catch (error) {
            setError("Unable to remove product");
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
                    <Link to="/my-orders">My Orders</Link>
                </nav>

                <Link className="header-login" to="/account">
                    My Account
                </Link>
            </header>

            <main className="products-page">

                <section className="products-heading">
                    <span>♥ YOUR SAVED PRODUCTS</span>

                    <h1>
                        My
                        <br />
                        <span>Wishlist.</span>
                    </h1>

                    <p>
                        Products you saved for later.
                    </p>
                </section>

                {loading && <p>Loading wishlist...</p>}

                {error && (
                    <div>
                        <p>{error}</p>

                        <button onClick={fetchWishlist}>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && wishlist.length === 0 && (
                    <div>
                        <h2>Your wishlist is empty.</h2>

                        <p>
                            Add products you love to see them here.
                        </p>

                        <Link to="/products">
                            Browse Products
                        </Link>
                    </div>
                )}

                {!loading && !error && wishlist.length > 0 && (
                    <section
                        className="product-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "25px",
                            width: "100%"
                        }}
                    >

                        {wishlist.map((product) => (
                            <div
                                className="product-card"
                                key={product._id}
                                style={{
                                    minWidth: 0,
                                    overflow: "hidden",
                                    border: "1px solid #30365b",
                                    borderRadius: "20px",
                                    background:
                                        "linear-gradient(145deg, #171c38, #10152d)",
                                    paddingBottom: "22px"
                                }}
                            >

                                <div className="product-image">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{
                                            width: "100%",
                                            height: "300px",
                                            objectFit: "cover",
                                            display: "block"
                                        }}
                                    />
                                </div>

                                <h2>{product.name}</h2>

                                <p className="product-price">
                                    ₹{product.price}
                                </p>

                                <p>{product.category}</p>

                                <p>Stock: {product.stock}</p>

                                <Link
                                    to={`/products/${product._id}`}
                                >
                                    View Details
                                </Link>

                                <br />

                                <button
                                    onClick={() =>
                                        removeProduct(product._id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        ))}

                    </section>
                )}

            </main>
        </div>
    );
}

export default Wishlist;