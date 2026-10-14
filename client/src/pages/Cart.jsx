import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../components/CartItem';
import {
    selectCartItems,
    selectCartLoading,
    selectCartError,
    selectCartTotalQuantity,
    selectCartSubtotal,
    fetchCart,
    clearCartError
} from '../features/cart/cartSlice';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const loading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const totalQuantity = useSelector(selectCartTotalQuantity);
    const subtotal = useSelector(selectCartSubtotal);

    const formattedSubtotal = `₹${subtotal.toLocaleString('en-IN')}`;

    const handleRetry = () => {
        dispatch(clearCartError());
        dispatch(fetchCart());
    };

    // Loading State
    if (loading) {
        return (
            <main className="page-container cart-page">
                <div className="state-container loading-state" id="cart-loading-state">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading your cart...</p>
                </div>
            </main>
        );
    }

    // Error State
    if (error) {
        return (
            <main className="page-container cart-page">
                <div className="state-container error-state" id="cart-error-state">
                    <div className="state-icon error-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Unable to load your cart</h2>
                    <p className="state-message">{error}</p>
                    <button
                        type="button"
                        className="btn-retry"
                        onClick={handleRetry}
                        id="cart-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    // Empty State
    if (cartItems.length === 0) {
        return (
            <main className="page-container cart-page">
                <div className="state-container empty-state cart-empty" id="cart-empty-state">
                    <div className="state-icon cart-empty-icon" aria-hidden="true">🛒</div>
                    <h2 className="state-title">Your cart is empty</h2>
                    <p className="state-submessage">
                        Looks like you haven't added anything yet.
                    </p>
                    <Link to="/products" className="btn-retry" id="cart-browse-products-btn">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    // Cart with Items
    return (
        <main className="page-container cart-page">
            <header className="cart-hero-header">
                <span className="section-eyebrow">Your Selection</span>
                <h1 className="cart-main-title">My Cart</h1>
                <p className="cart-subtitle">
                    {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ready for checkout
                </p>
            </header>

            <div className="cart-layout">
                <section className="cart-items-section" aria-label="Cart items" id="cart-items-list">
                    {cartItems.map((item) => (
                        <CartItem key={item.product._id} item={item} />
                    ))}
                </section>

                <aside className="order-summary-card" id="order-summary">
                    <h2 className="order-summary-title">Order Summary</h2>
                    <div className="order-summary-rows">
                        <div className="summary-row">
                            <span className="summary-label">Items</span>
                            <span className="summary-value">{totalQuantity}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value summary-subtotal">{formattedSubtotal}</span>
                        </div>
                    </div>
                    <div className="order-summary-divider"></div>
                    <div className="summary-row summary-total-row">
                        <span className="summary-label total-label">Total</span>
                        <span className="summary-value summary-total-value">{formattedSubtotal}</span>
                    </div>
                    <button
                        type="button"
                        className="btn-checkout"
                        id="checkout-btn"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </button>
                    <Link to="/products" className="btn-continue-shopping-cart">
                        ← Continue Shopping
                    </Link>
                </aside>
            </div>
        </main>
    );
};

export default Cart;
