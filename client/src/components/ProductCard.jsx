import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist } from '../services/api';
import { addToCart, selectIsAddingProduct, selectIsProductInCart } from '../features/cart/cartSlice';

const ProductCard = ({ product, isInWishlist: initialWishlistState = false }) => {
    const isOutOfStock = product.stock <= 0;
    const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;
    const dispatch = useDispatch();

    const isAddingToCart = useSelector((state) => selectIsAddingProduct(state, product._id));
    const isInCart = useSelector((state) => selectIsProductInCart(state, product._id));

    const [wishlistStatus, setWishlistStatus] = useState(
        initialWishlistState ? 'added' : 'idle'
    ); // idle | saving | added | error

    const handleAddToWishlist = async () => {
        if (wishlistStatus === 'saving' || wishlistStatus === 'added') return;

        setWishlistStatus('saving');
        try {
            await addToWishlist(product._id);
            setWishlistStatus('added');
        } catch (err) {
            if (err.response && err.response.status === 409) {
                // Already in wishlist
                setWishlistStatus('added');
            } else {
                setWishlistStatus('error');
                setTimeout(() => setWishlistStatus('idle'), 3000);
            }
        }
    };

    const handleAddToCart = () => {
        if (isAddingToCart || isOutOfStock) return;
        dispatch(addToCart(product._id));
    };

    const getWishlistButtonContent = () => {
        switch (wishlistStatus) {
            case 'saving':
                return '⏳ Saving...';
            case 'added':
                return '♥ Added to Wishlist';
            case 'error':
                return 'Unable to save. Try again.';
            default:
                return '♡ Add to Wishlist';
        }
    };

    const getCartButtonContent = () => {
        if (isAddingToCart) return '⏳ Adding...';
        if (isOutOfStock) return 'Out of Stock';
        if (isInCart) return '🛒 Add Another';
        return '🛒 Add to Cart';
    };

    return (
        <article className="product-card" data-product-id={product._id}>
            <div className="product-card-image-wrap">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';
                    }}
                />
                <span className="product-category-tag">{product.category}</span>
                {/* Wishlist heart icon on image */}
                <button
                    type="button"
                    className={`wishlist-heart-btn ${wishlistStatus === 'added' ? 'wishlisted' : ''}`}
                    onClick={handleAddToWishlist}
                    disabled={wishlistStatus === 'saving'}
                    aria-label={wishlistStatus === 'added' ? 'Added to wishlist' : 'Add to wishlist'}
                    id={`wishlist-heart-${product._id}`}
                >
                    {wishlistStatus === 'added' ? '♥' : '♡'}
                </button>
            </div>

            <div className="product-card-body">
                <h3 className="product-card-title" title={product.name}>
                    {product.name}
                </h3>
                <div className="product-card-category-sub">{product.category}</div>

                <div className="product-card-pricing-row">
                    <span className="product-card-price">{formattedPrice}</span>
                    <span
                        className={`product-card-stock ${isOutOfStock ? 'stock-empty' : product.stock <= 5 ? 'stock-low' : 'stock-available'
                            }`}
                    >
                        {isOutOfStock ? 'Out of stock' : `${product.stock} units left`}
                    </span>
                </div>

                <div className="product-card-actions">
                    <Link
                        to={`/products/${product._id}`}
                        className="btn-view-details"
                        id={`view-details-${product._id}`}
                    >
                        View Details
                    </Link>
                    <button
                        type="button"
                        className={`btn-add-to-cart-card ${isInCart ? 'btn-in-cart' : ''}`}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || isOutOfStock}
                        id={`add-cart-btn-${product._id}`}
                    >
                        {getCartButtonContent()}
                    </button>
                    <button
                        type="button"
                        className={`btn-wishlist ${wishlistStatus === 'added' ? 'btn-wishlisted' : ''} ${wishlistStatus === 'error' ? 'btn-wishlist-error' : ''}`}
                        onClick={handleAddToWishlist}
                        disabled={wishlistStatus === 'saving' || wishlistStatus === 'added'}
                        id={`wishlist-btn-${product._id}`}
                    >
                        {getWishlistButtonContent()}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
