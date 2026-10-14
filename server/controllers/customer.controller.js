import Customer from "../models/customer.model.js";
import bcrypt from "bcrypt";
import { genToken } from "../utils/generateToken.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
};

export const RegisterCustomer = async (req, res) => {
    try {
        const fullName = req.body.fullName || req.body.name;
        const phone = req.body.phone || req.body.Phone;
        const { email, password } = req.body;

        if (!fullName || !email || !password || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const emailExists = await Customer.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = await Customer.create({
            fullName,
            phone,
            email,
            password: hashedPassword
        });

        const token = genToken(newCustomer._id);
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: {
                "_id": newCustomer._id,
                "fullName": newCustomer.fullName,
                "email": newCustomer.email,
                "phone": newCustomer.phone
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordCheck = await bcrypt.compare(password, customer.password);
        if (!passwordCheck) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = genToken(customer._id);
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getme = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({
            "_id": user._id,
            "fullName": user.fullName,
            "email": user.email,
            "phone": user.phone
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", cookieOptions);
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
