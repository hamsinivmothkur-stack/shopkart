import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/cart",
                {
                    withCredentials: true
                }
            );

            setCart(response.data.cart);
        } catch (error) {
            setCart([]);
            setError("Unable to load cart");
        } finally {
            setLoading(false);
        }
    };

    // Called after a verified payment — clears the cart in UI
    const clearCart = () => {
        setCart([]);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                loading,
                error,
                fetchCart,
                clearCart,
                cartCount: cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                )
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}