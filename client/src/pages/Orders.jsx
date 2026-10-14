import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersApi } from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getOrdersApi();
            if (response.data.success) {
                setOrders(response.data.orders);
            } else {
                setError(response.data.message || 'Failed to fetch orders');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Loading State
    if (loading) {
        return (
            <main className="page-container orders-page">
                <div className="state-container loading-state" id="orders-loading-state">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading your orders...</p>
                </div>
            </main>
        );
    }

    // Error State
    if (error) {
        return (
            <main className="page-container orders-page">
                <div className="state-container error-state" id="orders-error-state">
                    <div className="state-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Unable to load orders</h2>
                    <p className="state-message">{error}</p>
                    <button
                        type="button"
                        className="btn-retry"
                        onClick={fetchOrders}
                        id="orders-retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    // Empty State
    if (orders.length === 0) {
        return (
            <main className="page-container orders-page">
                <div className="state-container empty-state orders-empty" id="orders-empty-state">
                    <div className="state-icon" aria-hidden="true">📦</div>
                    <h2 className="state-title">You have not placed any orders yet.</h2>
                    <p className="state-submessage">Browse our catalog and start shopping!</p>
                    <Link to="/products" className="btn-retry" id="start-shopping-btn">
                        Start Shopping
                    </Link>
                </div>
            </main>
        );
    }

    // Orders List
    return (
        <main className="page-container orders-page">
            <header className="orders-hero-header">
                <span className="section-eyebrow">Purchase History</span>
                <h1 className="orders-main-title">My Orders</h1>
                <p className="orders-subtitle">
                    Showing {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed with ShopKart
                </p>
            </header>

            <div className="orders-list-grid" id="orders-list">
                {orders.map((order) => {
                    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    });

                    return (
                        <div key={order._id} className="order-history-card" id={`order-card-${order._id}`}>
                            <div className="order-card-header">
                                <div>
                                    <h3 className="order-id-title">Order #{order._id}</h3>
                                    <span className="order-date-text">{formattedDate}</span>
                                </div>
                                <div className="order-badges-group">
                                    <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    {order.paymentStatus && (
                                        <span className={`status-badge status-${order.paymentStatus?.toLowerCase()}`}>
                                            {order.paymentStatus}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="order-card-items">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="order-item-snapshot-row">
                                        <div className="order-item-left">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="order-item-thumb"
                                                />
                                            )}
                                            <span className="order-item-name-qty">
                                                {item.name} × {item.quantity}
                                            </span>
                                        </div>
                                        <span className="order-item-snapshot-price">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card-footer">
                                <div className="order-footer-total">
                                    <span className="footer-total-label">Total:</span>
                                    <span className="footer-total-value">
                                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <Link
                                    to={`/orders/${order._id}`}
                                    className="btn-view-details"
                                    id={`view-details-${order._id}`}
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default Orders;
