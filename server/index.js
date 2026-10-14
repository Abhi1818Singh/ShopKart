import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import CustomerRoutes from "./routes/customer.routes.js";
import ProductRoutes from "./routes/product.routes.js";
import WishlistRoutes from "./routes/wishlist.routes.js";
import CartRoutes from "./routes/cart.routes.js";
import OrderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8008;

// Connect to MongoDB
mongoose.connect(process.env.dbURL)
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/customers', CustomerRoutes);
app.use('/products', ProductRoutes);
app.use('/wishlist', WishlistRoutes);
app.use('/cart', CartRoutes);
app.use('/orders', OrderRoutes);

app.get('/', (req, res) => {
    res.json({ message: "ShopKart API is running" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
