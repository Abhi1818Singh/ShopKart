import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import { getProfile } from './services/api';
import { fetchCart, clearCart } from './features/cart/cartSlice';

function App() {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setInitializing(false);
            }
        };

        verifyUser();
    }, []);

    // Fetch cart when user is authenticated, clear on logout
    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        } else {
            dispatch(clearCart());
        }
    }, [user, dispatch]);

    if (initializing) {
        return (
            <div className="loading-container" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
                <p>Loading ShopKart...</p>
            </div>
        );
    }

    return (
        <Router>
            <Navbar user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/home" element={<Home user={user} setUser={setUser} />} />
                <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
                <Route path="/products" element={user ? <Products /> : <Navigate to="/login" replace />} />
                <Route path="/products/:id" element={user ? <ProductDetails /> : <Navigate to="/login" replace />} />
                <Route path="/wishlist" element={user ? <Wishlist /> : <Navigate to="/login" replace />} />
                <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" replace />} />
                <Route path="/checkout" element={user ? <Checkout user={user} /> : <Navigate to="/login" replace />} />
                <Route path="/order-success/:id" element={user ? <OrderConfirmation /> : <Navigate to="/login" replace />} />
                <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" replace />} />
                <Route path="/orders/:id" element={user ? <OrderDetails /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
