import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../shopkart.css";
import { useCart } from "../CartContext";

function Products() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [wishlist, setWishlist] = useState([]);
   const [savingWishlist, setSavingWishlist] = useState(null);
   const [search, setSearch] = useState("");
   const [category, setCategory] = useState("");
   const [sort, setSort] = useState("");
   const { fetchCart, cartCount } = useCart();
   const [addedProduct, setAddedProduct] = useState(null);

  useEffect(() => {
  async function getProducts() {
    try {
      const response = await axios.get("http://localhost:3000/products", {
      params: {
      search: search,
      category: category,
      sort : sort,
      },
     });
      setProducts(response.data.products);
    } catch (error) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  getProducts();
}, [search, category, sort]);

useEffect(() => {
  async function getWishlist() {
    try {
      const response = await axios.get(
        "http://localhost:3000/wishlist",
        {
          withCredentials: true
        }
      );

      setWishlist(response.data.wishlist);
    } catch (error) {
      console.log("Unable to load wishlist");
    }
  }

  getWishlist();
}, []);


  return (
    <div className="shopkart-page">

      <header className="shopkart-header">
        <Link className="brand" to="/home">
          🛒 Shop<span>Kart</span>
        </Link>

        <nav>
          <Link to="/home">Home</Link>
           <Link to="/products">Products</Link> 
           <Link to="/cart">Cart ({cartCount})</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/my-orders">My Orders</Link>
        </nav>

        <Link className="header-login" to="/account">
          My Account
        </Link>
      </header>

      <main className="products-page">
        <section className="products-heading">
          <span>✨ EXPLORE OUR COLLECTION</span>

          <h1>
            Find something
            <br />
            <span>you'll love.</span>
          </h1>

          <p>
            Discover our collection of products made for everyday shopping.
          </p>
        </section>

        {loading && <p>Loading products...</p>}

          {error && <p>{error}</p>}

          <div className="product-filters">
  <input
  className="product-filter-input"
  type="text"
  placeholder="Search products..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
</div>

<div>
  <select
  className="product-filter-select"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">All Categories</option>
<option value="Electronics">Electronics</option>
<option value="Fashion">Fashion</option>
<option value="Books">Books</option>
<option value="Clothing">Clothing</option>
<option value="Footwear">Footwear</option>
<option value="Home & Kitchen">Home & Kitchen</option>
<option value="Beauty">Beauty</option>
<option value="Bags">Bags</option>
<option value="Instruments">Instruments</option>

  </select>
  <div>
  <select
    className="product-filter-select"
    value={sort}
    onChange={(e) => setSort(e.target.value)}
  >
    <option value="">Sort By</option>
    <option value="price_asc">Price: Low to High</option>
    <option value="price_desc">Price: High to Low</option>
  </select>
   </div>
   </div>

           {!loading && !error && products.length === 0 && (
           <p>No products found.</p>
        )}

       <section
         className="product-grid"
          style={{
           display: "grid",
           gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
           gap: "25px",
           width: "100%",
           }}
        >
      {products.map((product) => (
      <div
      className="product-card"
      key={product._id}
      style={{
       minWidth: 0,
       overflow: "hidden",
       border: "1px solid #30365b",
       borderRadius: "20px",
       background: "linear-gradient(145deg, #171c38, #10152d)",
       paddingBottom: "22px",
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
            display: "block",
          }}
        />
      </div>

      <h2>{product.name}</h2>

      <p className="product-price">
        ₹{product.price}
      </p>

      <p>{product.category}</p>

      <p>Stock: {product.stock}</p>

       <Link to={`/products/${product._id}`}>
         View Details
        </Link>


        <button
    onClick={async () => {
        try {
            await axios.post(
                `http://localhost:3000/cart/${product._id}`,
                {},
                {
                    withCredentials: true
                }
            );

            await fetchCart();
            setAddedProduct(product._id);
        } catch (error) {
            console.log("Unable to add product to cart");
        }
    }}
>
    {addedProduct === product._id ? "✓ Added to Cart" : "🛒 Add to Cart"}
</button>

        <button
  onClick={async () => {
    try {
      setSavingWishlist(product._id);

      await axios.post(
        `http://localhost:3000/wishlist/${product._id}`,
        {},
        {
          withCredentials: true
        }
      );

      setWishlist([...wishlist, product]);
    } catch (error) {
      console.log("Unable to add to wishlist");
    } finally {
      setSavingWishlist(null);
    }
  }}

  disabled={
    wishlist.some((item) => item._id === product._id) ||
    savingWishlist === product._id
  }
>
  {savingWishlist === product._id
    ? "⏳ Saving..."
    : wishlist.some((item) => item._id === product._id)
    ? "♥ Added to Wishlist"
    : "♡ Add to Wishlist"}
</button>


    </div>
  ))}
</section>

      </main>
    </div>
  );
}

export default Products;