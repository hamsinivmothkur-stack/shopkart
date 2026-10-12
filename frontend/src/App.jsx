import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Account from "./pages/Account";
import Wishlist from "./Wishlist";
import { CartProvider } from "./CartContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/checkout";
import MyOrders from "./pages/my-orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetails from "./pages/OrderDetails";

function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/register" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/order-details/:orderId" element={<OrderDetails />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;