import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const sampleProducts = [
    {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with tactile blue switches, customizable backlighting, and programmable macro keys.",
        price: 2999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60",
        stock: 10
    },
    {
        name: "Noise Cancelling Headphones",
        description: "Wireless over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio fidelity.",
        price: 4999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
        stock: 25
    },
    {
        name: "Classic Denim Jacket",
        description: "Timeless vintage wash denim jacket made from 100% durable cotton with metallic buttons.",
        price: 2499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=60",
        stock: 18
    },
    {
        name: "Minimalist Sneaker",
        description: "Breathable low-top everyday sneakers designed for all-day comfort and modern streetwear aesthetics.",
        price: 3499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60",
        stock: 14
    },
    {
        name: "Clean Code by Robert C. Martin",
        description: "A handbook of agile software craftsmanship teaching best practices for writing maintainable and robust code.",
        price: 1299,
        category: "Books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60",
        stock: 30
    },
    {
        name: "Designing Data-Intensive Applications",
        description: "The definitive guide to the principles and architectures of scalable, reliable, and maintainable systems.",
        price: 1899,
        category: "Books",
        image: "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=800&auto=format&fit=crop&q=60",
        stock: 20
    },
    {
        name: "Ergonomic Desk Lamp",
        description: "Smart LED desk lamp with adjustable color temperatures, brightness dimming, and touch controls.",
        price: 1799,
        category: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60",
        stock: 12
    },
    {
        name: "Ceramic Pour-Over Coffee Dripper",
        description: "Handcrafted artisanal ceramic coffee dripper for brewing rich, aromatic artisanal drip coffee at home.",
        price: 899,
        category: "Home",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60",
        stock: 8
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.dbURL);
        console.log("Connected to MongoDB for seeding...");

        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(sampleProducts);
            console.log(`Seeded ${sampleProducts.length} sample products successfully!`);
        } else {
            console.log(`Database already contains ${count} products.`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();
