import express from 'express';
import { RegisterCustomer, login, getme, logout } from '../controllers/customer.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const customerRoutes = express.Router();

customerRoutes.post('/register', RegisterCustomer);
customerRoutes.post('/login', login);
customerRoutes.get('/me', isAuthenticated, getme);
customerRoutes.get('/getme', isAuthenticated, getme);
customerRoutes.post('/logout', isAuthenticated, logout);

export default customerRoutes;
