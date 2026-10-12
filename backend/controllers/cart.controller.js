const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const existingItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                });
            }

            existingItem.quantity += 1;
        } else {
            customer.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product added to cart"
        });

    } catch (error) {
        console.error("Add cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getCart = async (req, res) => {
    try {
        const customer = await Customer.findById(req.user._id)
            .populate({
                path: "cart.product",
                select: "name price category image stock"
            });

        return res.status(200).json({
            success: true,
            cart: customer.cart
        });

    } catch (error) {
        console.error("Get cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load cart"
        });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const cartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        cartItem.quantity = quantity;

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated"
        });

    } catch (error) {
        console.error("Update cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const index = customer.cart.findIndex(
            (item) => item.product.toString() === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        customer.cart.splice(index, 1);

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from cart"
        });

    } catch (error) {
        console.error("Remove cart error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};