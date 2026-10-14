import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartNotification, setCartNotification] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchProduct = async () => {
            if (isMounted) {
                setLoading(true);
                setError('');
            }
            try {
                const response = await getProductById(id);
                if (isMounted) {
                    // Support both response.data.product and direct response.data
                    const data = response.data?.product || response.data;
                    if (data && data._id) {
                        setProduct(data);
                    } else {
                        setError('Product details could not be found.');
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to fetch product:', err);
                    if (err.response && err.response.status === 404) {
                        setError('Product not found.');
                    } else if (err.response && err.response.status === 400) {
                        setError('Invalid product ID provided.');
                    } else {
                        setError('Something went wrong while loading product details.');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchProduct();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAddToCart = () => {
        setCartNotification(`${product.name} added to cart! (Cart functionality coming in Lab-04)`);
        setTimeout(() => {
            setCartNotification('');
        }, 3500);
    };

    if (loading) {
        return (
            <main className="page-container">
                <div className="state-container loading-state" id="loading-state">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading product details...</p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="page-container">
                <div className="state-container error-state" id="error-state">
                    <div className="state-icon error-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Error</h2>
                    <p className="state-message">{error || 'Product not found.'}</p>
                    <Link to="/products" className="btn-back-link">
                        ← Back to Products
                    </Link>
                </div>
            </main>
        );
    }

    const isOutOfStock = product.stock <= 0;
    const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;

    return (
        <main className="page-container product-details-page">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link to="/products" className="breadcrumb-link">
                    Products
                </Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-category">{product.category}</span>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{product.name}</span>
            </nav>

            <div className="product-details-container">
                <div className="product-details-image-section">
                    <div className="large-image-wrapper">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="large-product-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60';
                            }}
                        />
                    </div>
                </div>

                <div className="product-details-info-section">
                    <div className="category-pill-badge">{product.category}</div>

                    <h1 className="product-details-title" id="product-title">{product.name}</h1>

                    <div className="product-details-price-tag" id="product-price">
                        {formattedPrice}
                    </div>

                    <div className="product-details-stock-row">
                        <span className="stock-label">Availability:</span>
                        <span
                            className={`product-details-stock-badge ${
                                isOutOfStock ? 'stock-empty' : product.stock <= 5 ? 'stock-low' : 'stock-available'
                            }`}
                            id="product-stock"
                        >
                            {isOutOfStock
                                ? 'Out of Stock'
                                : `${product.stock} units in stock`}
                        </span>
                    </div>

                    <div className="product-details-description-box">
                        <h2 className="description-heading">Product Description</h2>
                        <p className="product-description-text" id="product-description">
                            {product.description}
                        </p>
                    </div>

                    {cartNotification && (
                        <div className="cart-notification-banner" role="status">
                            {cartNotification}
                        </div>
                    )}

                    <div className="product-action-buttons">
                        <button
                            type="button"
                            id="add-to-cart-btn"
                            className="btn-add-to-cart"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                        >
                            <svg
                                className="cart-btn-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <button
                            type="button"
                            className="btn-back-secondary"
                            onClick={() => navigate('/products')}
                        >
                            Back to Catalogue
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
