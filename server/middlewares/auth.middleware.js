import jwt from 'jsonwebtoken';
import Customer from '../models/customer.model.js';

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const customer = await Customer.findById(decoded.userId).select("-password");
        if (!customer) {
            return res.status(401).json({ message: "Customer Not Found / Token Invalid" });
        }

        req.user = customer;
        req.customer = customer;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
};
