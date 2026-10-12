require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const customerRoutes = require("./routes/customer.routes");
const cors = require("cors");
const productRoutes = require("./routes/product.route");
const wishlistRoutes = require("./routes/wishlist.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");

const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173"
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Request received:", req.method, req.originalUrl);
    next();
});

app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);


app.get("/", (req, res) => {
    res.send("ShopKart Backend is Running!");
});

const PORT = process.env.PORT || 3000;

console.log("Starting ShopKart...");

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });