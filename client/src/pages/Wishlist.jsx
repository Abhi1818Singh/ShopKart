import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WishlistCard from '../components/WishlistCard';
import { getWishlist } from '../services/api';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWishlist = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getWishlist();
            if (response.data && Array.isArray(response.data.wishlist)) {
                setWishlist(response.data.wishlist);
            } else {
                setWishlist([]);
            }
        } catch (err) {
            console.error('Error loading wishlist:', err);
            setError('Something went wrong. We couldn\'t load your wishlist.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleProductRemoved = (removedProductId) => {
        setWishlist((prev) => prev.filter((p) => p._id !== removedProductId));
    };

    // Loading State
    if (loading) {
        return (
            <main className="page-container wishlist-page">
                <div className="state-container loading-state" id="wishlist-loading-state">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading your wishlist...</p>
                </div>
            </main>
        );
    }

    // Error State
    if (error) {
        return (
            <main className="page-container wishlist-page">
                <div className="state-container error-state" id="wishlist-error-state">
                    <div className="state-icon error-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Something went wrong</h2>
                    <p className="state-message">{error}</p>
                    <button
                        type="button"
                        className="btn-retry"
                        onClick={fetchWishlist}
                        id="wishlist-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    // Empty State
    if (wishlist.length === 0) {
        return (
            <main className="page-container wishlist-page">
                <div className="state-container empty-state wishlist-empty" id="wishlist-empty-state">
                    <div className="state-icon wishlist-empty-heart" aria-hidden="true">❤️</div>
                    <h2 className="state-title">Your wishlist is empty</h2>
                    <p className="state-submessage">
                        Save products you love and find them here later.
                    </p>
                    <Link to="/products" className="btn-retry" id="browse-products-btn">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    // Wishlist with Products
    return (
        <main className="page-container wishlist-page">
            <header className="wishlist-hero-header">
                <span className="section-eyebrow">Your Collection</span>
                <h1 className="wishlist-main-title">My Wishlist</h1>
                <p className="wishlist-subtitle">
                    {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
                </p>
            </header>

            <section className="wishlist-grid" aria-label="Wishlist products" id="wishlist-grid">
                {wishlist.map((product) => (
                    <WishlistCard
                        key={product._id}
                        product={product}
                        onRemoved={handleProductRemoved}
                    />
                ))}
            </section>

            <div className="wishlist-continue-shopping">
                <Link to="/products" className="btn-continue-shopping">
                    ← Continue Shopping
                </Link>
            </div>
        </main>
    );
};

export default Wishlist;
