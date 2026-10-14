import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Cart (POST /cart/:productId)
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const userId = req.user._id;
        const user = await Customer.findById(userId);

        // Check if product is already in cart
        const existingItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            // Increase quantity by 1
            const newQuantity = existingItem.quantity + 1;

            // Validate stock
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add more. Only ${product.stock} units available in stock.`
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            // Add new item with quantity 1
            if (product.stock < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Product is out of stock"
                });
            }

            user.cart.push({ product: productId, quantity: 1 });
        }

        await user.save();

        // Populate cart for response
        await user.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: user.cart
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 3: Get Current User's Cart (GET /cart)
export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Customer.findById(userId).populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            cart: user.cart
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 4: Update Product Quantity (PATCH /cart/:productId)
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        // Validate quantity
        if (typeof quantity !== "number" || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a number"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Validate against stock
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Quantity exceeds available stock. Only ${product.stock} units available.`
            });
        }

        const userId = req.user._id;
        const user = await Customer.findById(userId);

        // Find item in cart
        const cartItem = user.cart.find(
            (item) => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        // Update quantity
        cartItem.quantity = quantity;
        await user.save();

        // Populate cart for response
        await user.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: user.cart
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 5: Remove Product from Cart (DELETE /cart/:productId)
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const userId = req.user._id;
        const user = await Customer.findById(userId);

        // Check if product is in cart
        const index = user.cart.findIndex(
            (item) => item.product.toString() === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        // Remove product from cart
        user.cart.splice(index, 1);
        await user.save();

        // Populate cart for response
        await user.populate({
            path: "cart.product",
            select: "name price image stock category"
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: user.cart
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
