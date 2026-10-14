import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProducts, getProfile } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            // Verify user auth (silent if not logged in)
            if (!user) {
                try {
                    const response = await getProfile();
                    if (isMounted && setUser) setUser(response.data);
                } catch {
                    if (isMounted && setUser) setUser(null);
                }
            }

            // Fetch featured products
            try {
                const response = await getProducts({});
                if (isMounted) {
                    const products = response.data?.products || response.data || [];
                    setFeaturedProducts(products.slice(0, 4));
                }
            } catch {
                // silently fail, just show hero
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        init();

        return () => { isMounted = false; };
    }, [navigate, setUser, user]);

    const categories = [
        { name: 'Electronics', emoji: '💻', desc: 'Latest gadgets & tech', color: '#6366f1' },
        { name: 'Fashion', emoji: '👗', desc: 'Trending styles', color: '#ec4899' },
        { name: 'Books', emoji: '📚', desc: 'Knowledge awaits', color: '#f59e0b' },
        { name: 'Home', emoji: '🏠', desc: 'Home essentials', color: '#10b981' }
    ];

    return (
        <main className="home-landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text-block">
                        <span className="hero-badge">🛍️ NEW COLLECTION 2026</span>
                        <h1 className="hero-title">
                            Shop the <span className="hero-accent">Future</span> of E-Commerce
                        </h1>
                        <p className="hero-description">
                            Discover our curated collection of electronics, fashion, books, and home essentials.
                            Premium quality, unbeatable prices.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="hero-btn-primary" id="btn-explore-products">
                                Browse Products →
                            </Link>
                            <Link to="/wishlist" className="hero-btn-secondary">
                                View Wishlist
                            </Link>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Products</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">Support</span>
                            </div>
                            <div className="hero-stat">
                                <span className="stat-number">Free</span>
                                <span className="stat-label">Shipping</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-visual-card hero-girl-card">
                            <img
                                src="/hero-girl.png"
                                alt="Fashion Collection"
                                className="hero-girl-img"
                            />
                            <div className="hero-floating-tag tag-1">Electronics 💻</div>
                            <div className="hero-floating-tag tag-2">Fashion 👗</div>
                            <div className="hero-floating-tag tag-3">Books 📚</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <span className="section-eyebrow">Shop by Category</span>
                    <h2 className="section-title">Explore Collections</h2>
                </div>
                <div className="categories-grid">
                    {categories.map((cat) => (
                        <Link
                            to={`/products?category=${cat.name}`}
                            key={cat.name}
                            className="category-card"
                            style={{ '--cat-color': cat.color }}
                        >
                            <span className="category-emoji">{cat.emoji}</span>
                            <h3 className="category-name">{cat.name}</h3>
                            <p className="category-desc">{cat.desc}</p>
                            <span className="category-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            {!loading && featuredProducts.length > 0 && (
                <section className="featured-section">
                    <div className="section-header">
                        <span className="section-eyebrow">Hand-Picked for You</span>
                        <h2 className="section-title">Featured Products</h2>
                    </div>
                    <div className="featured-products-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                    <div className="featured-cta">
                        <Link to="/products" className="hero-btn-primary">
                            View All Products →
                        </Link>
                    </div>
                </section>
            )}

            {/* Marquee Banner */}
            <section className="marquee-banner">
                <div className="marquee-track">
                    <span>FREE SHIPPING ON ALL ORDERS</span>
                    <span>•</span>
                    <span>PREMIUM QUALITY GUARANTEED</span>
                    <span>•</span>
                    <span>24/7 CUSTOMER SUPPORT</span>
                    <span>•</span>
                    <span>SECURE RAZORPAY PAYMENTS</span>
                    <span>•</span>
                    <span>FREE SHIPPING ON ALL ORDERS</span>
                    <span>•</span>
                    <span>PREMIUM QUALITY GUARANTEED</span>
                    <span>•</span>
                    <span>24/7 CUSTOMER SUPPORT</span>
                    <span>•</span>
                    <span>SECURE RAZORPAY PAYMENTS</span>
                    <span>•</span>
                </div>
            </section>
        </main>
    );
};

export default Home;
