import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { logoutCustomer } from '../services/api';
import { selectCartTotalQuantity } from '../features/cart/cartSlice';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const cartCount = useSelector(selectCartTotalQuantity);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [bgTheme, setBgTheme] = useState(() => localStorage.getItem('shopkart_bg_theme') || 'blue');

    useEffect(() => {
        document.body.className = `theme-${bgTheme}`;
        localStorage.setItem('shopkart_bg_theme', bgTheme);
    }, [bgTheme]);

    const handleLogout = async () => {
        try {
            await logoutCustomer();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            if (setUser) setUser(null);
            navigate('/login');
        }
    };

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="navbar">
            <Link to="/home" className="nav-brand">
                <img src="/logo-transparent.png" alt="ShopKart Logo" className="nav-brand-logo" />
                <span>ShopKart</span>
            </Link>

            <div className="bg-theme-switcher" aria-label="Select background theme">
                <button
                    type="button"
                    className={`theme-pill pill-blue ${bgTheme === 'blue' ? 'active' : ''}`}
                    onClick={() => setBgTheme('blue')}
                    title="Light Blue Background"
                >
                    🩵 Blue
                </button>
                <button
                    type="button"
                    className={`theme-pill pill-pink ${bgTheme === 'pink' ? 'active' : ''}`}
                    onClick={() => setBgTheme('pink')}
                    title="Pink Background"
                >
                    🌸 Pink
                </button>
                <button
                    type="button"
                    className={`theme-pill pill-black ${bgTheme === 'black' ? 'active' : ''}`}
                    onClick={() => setBgTheme('black')}
                    title="Black Background"
                >
                    🖤 Black
                </button>
            </div>

            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
            >
                <span className={`hamburger ${mobileOpen ? 'open' : ''}`}></span>
            </button>

            <nav className={`nav-links ${mobileOpen ? 'nav-open' : ''}`}>
                <Link
                    to="/home"
                    id="nav-home"
                    className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                    onClick={closeMobile}
                >
                    Home
                </Link>
                {user ? (
                    <>
                        <Link
                            to="/products"
                            id="nav-products"
                            className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Products
                        </Link>
                        <Link
                            to="/wishlist"
                            id="nav-wishlist"
                            className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Wishlist
                        </Link>
                        <Link
                            to="/cart"
                            id="nav-cart"
                            className={`nav-link nav-cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Cart
                            {cartCount > 0 && (
                                <span className="cart-count-badge" id="cart-count-badge">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/orders"
                            id="nav-orders"
                            className={`nav-link ${location.pathname.startsWith('/orders') ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Orders
                        </Link>
                        <div className="nav-user">
                            <Link
                                to="/profile"
                                className={`nav-profile-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                onClick={closeMobile}
                            >
                                <span className="nav-avatar">
                                    {user.fullName?.charAt(0)?.toUpperCase()}
                                </span>
                                <span className="nav-username">{user.fullName}</span>
                            </Link>
                            <button
                                id="logout-btn"
                                onClick={handleLogout}
                                className="btn-logout"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            id="nav-login"
                            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                            onClick={closeMobile}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            id="nav-register"
                            className={`nav-link nav-register-link ${location.pathname === '/register' ? 'active' : ''}`}
                            style={{ color: '#000000', fontWeight: 'bold' }}
                            onClick={closeMobile}
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Navbar;
