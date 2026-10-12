import { Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../shopkart.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

 
  useEffect(() => {
    async function getProduct() {
      try {
        const response = await axios.get(
          `http://localhost:3000/products/${id}`
        );

        setProduct(response.data.product);
      } catch (error) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [id]);

  if (loading) {
    return <p>Loading product...</p>;
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
        </nav>

        <Link className="header-login" to="/login">
          My Account
        </Link>
      </header>

      <main>
        {product && (
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <h2>₹{product.price}</h2>

            <p>Category: {product.category}</p>

            <p>Stock: {product.stock}</p>

            
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;