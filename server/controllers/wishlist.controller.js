import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Wishlist (POST /wishlist/:productId)
export const addToWishlist = async (req, res) => {
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

        // Get current user from auth middleware
        const userId = req.user._id;
        const user = await Customer.findById(userId);

        // Check for duplicate
        if (user.wishlist.includes(productId)) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        // Add product to wishlist
        user.wishlist.push(productId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 3: Get Current User's Wishlist (GET /wishlist)
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await Customer.findById(userId).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        return res.status(200).json({
            success: true,
            count: user.wishlist.length,
            wishlist: user.wishlist
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 4: Remove Product from Wishlist (DELETE /wishlist/:productId)
export const removeFromWishlist = async (req, res) => {
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

        // Check if product is in wishlist
        const index = user.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not in wishlist"
            });
        }

        // Remove product from wishlist
        user.wishlist.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
