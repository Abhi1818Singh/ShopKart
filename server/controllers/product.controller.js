import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Helper to escape regex special characters
const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Task 2: Create Product API (POST /products)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        // Validation: Missing required fields
        if (
            !name ||
            !description ||
            price === undefined ||
            price === null ||
            price === "" ||
            !category ||
            !image ||
            stock === undefined ||
            stock === null ||
            stock === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: name, description, price, category, image, and stock"
            });
        }

        const numPrice = Number(price);
        const numStock = Number(stock);

        // Validation: Invalid price (must be greater than 0)
        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a number greater than 0"
            });
        }

        // Validation: Invalid stock (cannot be negative)
        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative number"
            });
        }

        const newProduct = await Product.create({
            name: typeof name === "string" ? name.trim() : name,
            description: typeof description === "string" ? description.trim() : description,
            price: numPrice,
            category: typeof category === "string" ? category.trim() : category,
            image: typeof image === "string" ? image.trim() : image,
            stock: numStock
        });

        const productObj = newProduct.toObject();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: productObj,
            ...productObj
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 3 & Task 5: Get All Products API with Search & Category Filtering (GET /products)
export const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;
        const query = {};

        // Search filter: case-insensitive name match
        if (search && search.trim() !== "") {
            query.name = {
                $regex: escapeRegex(search.trim()),
                $options: "i"
            };
        }

        // Category filter: case-insensitive match (ignore if "All" or "all")
        if (category && category.trim() !== "" && category.trim().toLowerCase() !== "all" && category.trim().toLowerCase() !== "all categories") {
            query.category = {
                $regex: `^${escapeRegex(category.trim())}$`,
                $options: "i"
            };
        }

        // Return only UI required fields: _id, name, price, category, image, stock
        const products = await Product.find(query)
            .select("_id name price category image stock")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

// Task 4: Get Single Product API (GET /products/:id)
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validation: Invalid product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id).select("-__v");

        // Validation: Product not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const productObj = product.toObject();

        return res.status(200).json({
            success: true,
            product: productObj,
            ...productObj
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
