import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { removeFromWishlist } from '../services/api';

const WishlistCard = ({ product, onRemoved }) => {
    const isOutOfStock = product.stock <= 0;
    const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState('');

    const handleRemove = async () => {
        if (removing) return;

        setRemoving(true);
        setError('');
        try {
            await removeFromWishlist(product._id);
            if (onRemoved) onRemoved(product._id);
        } catch (err) {
            setError('Failed to remove. Try again.');
            setRemoving(false);
        }
    };

    return (
        <article className="wishlist-card" data-product-id={product._id}>
            <div className="wishlist-card-image-wrap">
                <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-card-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';
                    }}
                />
                <span className="wishlist-category-tag">{product.category}</span>
            </div>

            <div className="wishlist-card-body">
                <h3 className="wishlist-card-title" title={product.name}>
                    {product.name}
                </h3>
                <div className="wishlist-card-category">{product.category}</div>
                <div className="wishlist-card-price">{formattedPrice}</div>
                <div className={`wishlist-card-stock ${isOutOfStock ? 'stock-empty' : product.stock <= 5 ? 'stock-low' : 'stock-available'}`}>
                    {isOutOfStock ? 'Out of stock' : `${product.stock} units left`}
                </div>

                {error && (
                    <div className="wishlist-card-error" role="alert">
                        {error}
                    </div>
                )}

                <div className="wishlist-card-actions">
                    <Link
                        to={`/products/${product._id}`}
                        className="btn-view-details"
                        id={`wishlist-view-${product._id}`}
                    >
                        View Details
                    </Link>
                    <button
                        type="button"
                        className="btn-remove-wishlist"
                        onClick={handleRemove}
                        disabled={removing}
                        id={`wishlist-remove-${product._id}`}
                    >
                        {removing ? 'Removing...' : 'Remove ♥'}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default WishlistCard;
