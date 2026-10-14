import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
    getOrderById
} from "../controllers/order.controller.js";

const router = express.Router();

// Protected Order Routes
router.post("/create-payment-order", isAuthenticated, createPaymentOrder);
router.post("/", isAuthenticated, createPaymentOrder); // Support POST /orders as in Postman test
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderById);

export default router;
