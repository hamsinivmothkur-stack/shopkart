
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");

const {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
} = require("../controllers/order.controller");

router.post(
    "/create-payment-order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify-payment",
    authMiddleware,
    verifyPayment
);

router.get(
    "/",
    authMiddleware,
    getMyOrders
);

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

console.log(
    "Registered order routes:",
    router.stack.map((layer) => ({
        path: layer.route?.path,
        methods: layer.route?.methods
    }))
);

module.exports = router;
