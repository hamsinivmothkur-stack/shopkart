
const crypto = require("crypto");
const Customer = require("../models/customer.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
    let order;

    try {
        if (!razorpay) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured"
            });
        }

        const { shippingAddress } = req.body;
        const customer = await Customer.findById(req.user._id);

        if (!customer || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        if (
            !shippingAddress ||
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.addressLine1 ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            return res.status(400).json({
                success: false,
                message: "Complete shipping details are required"
            });
        }

        const items = [];
        let totalAmount = 0;

        for (const cartItem of customer.cart) {
            const product = await Product.findById(cartItem.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (
                !Number.isInteger(cartItem.quantity) ||
                cartItem.quantity < 1 ||
                cartItem.quantity > product.stock
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            items.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });

            totalAmount += product.price * cartItem.quantity;
        }

        order = await Order.create({
            user: customer._id,
            items,
            totalAmount,
            shippingAddress
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            success: true,
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        console.error("Create order error:", error);

        // Remove an unpaid draft if Razorpay order creation failed.
        if (order && !order.razorpayOrderId) {
            await Order.findByIdAndDelete(order._id).catch(() => {});
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create payment order"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(503).json({
                success: false,
                message: "Razorpay is not configured"
            });
        }

        const {
            orderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !orderId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification details are missing"
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.razorpayOrderId !== razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Order ID does not match"
            });
        }

        // Do not process the same paid order twice.
        if (order.paymentStatus === "PAID") {
            return res.json({
                success: true,
                message: "Payment already verified",
                orderId: order._id
            });
        }

        // Verify the signature using the server-side secret.
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
            .digest("hex");

        const expectedBuffer = Buffer.from(expectedSignature, "hex");
        const receivedBuffer = Buffer.from(razorpay_signature, "hex");

        if (
            expectedBuffer.length !== receivedBuffer.length ||
            !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Confirm payment details directly with Razorpay.
        const payment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        if (
            payment.order_id !== order.razorpayOrderId ||
            payment.amount !== Math.round(order.totalAmount * 100) ||
            payment.currency !== "INR" ||
            payment.status !== "captured"
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment is not captured or details do not match"
            });
        }

        const customer = await Customer.findById(req.user._id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Confirm stock again before updating it.
        for (const item of order.items) {
            const product = await Product.findById(item.product);

            if (!product || product.stock < item.quantity) {
                return res.status(409).json({
                    success: false,
                    message: `Stock issue for ${item.name}. Payment was captured; contact support.`
                });
            }
        }

        // Reduce stock for this order.
        for (const item of order.items) {
            const result = await Product.updateOne(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: { stock: -item.quantity }
                }
            );

            if (result.modifiedCount !== 1) {
                return res.status(409).json({
                    success: false,
                    message: `Stock changed during checkout for ${item.name}. Contact support.`
                });
            }
        }

        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentStatus = "PAID";
        order.status = "PLACED";
        await order.save();

        // Clear the cart only after payment verification succeeds.
        customer.cart = [];
        await customer.save();

        return res.json({
            success: true,
            message: "Payment verified and order placed",
            orderId: order._id
        });
    } catch (error) {
        console.error("Payment verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to verify payment"
        });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch orders"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            _id: id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get order by id error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch order"
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
};
