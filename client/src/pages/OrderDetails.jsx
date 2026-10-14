import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdApi } from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrder = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getOrderByIdApi(id);
            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                setError(response.data.message || 'Order not found');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="page-container order-details-page">
                <div className="state-container loading-state" id="order-details-loading">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Loading order details...</p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="page-container order-details-page">
                <div className="state-container error-state" id="order-details-error">
                    <div className="state-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Order Not Found</h2>
                    <p className="state-message">{error || 'This order does not exist or you do not have permission to view it.'}</p>
                    <Link to="/orders" className="btn-retry">
                        Back to My Orders
                    </Link>
                </div>
            </main>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <main className="page-container order-details-page">
            <div className="order-details-top-bar">
                <Link to="/orders" className="btn-back-link">
                    ← Back to My Orders
                </Link>
                <div className="order-details-meta">
                    <span className="order-meta-id">Order #{order._id}</span>
                    <span className="order-meta-date">{formattedDate}</span>
                </div>
            </div>

            <div className="order-details-grid">
                {/* Left column: Items breakdown */}
                <section className="order-details-items-section">
                    <div className="order-details-card">
                        <h2 className="card-section-heading">Purchased Items</h2>
                        <div className="order-details-items-list">
                            {order.items?.map((item, index) => (
                                <div key={index} className="order-detail-item-row">
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="order-detail-thumb"
                                        />
                                    )}
                                    <div className="order-detail-item-info">
                                        <h3 className="order-detail-name">{item.name}</h3>
                                        <span className="order-detail-unit-price">
                                            ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                                        </span>
                                    </div>
                                    <span className="order-detail-line-total">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-details-total-breakdown">
                            <div className="detail-total-row grand-total-row">
                                <span>Grand Total</span>
                                <span className="grand-total-amount">
                                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right column: Status & Delivery info */}
                <aside className="order-details-sidebar">
                    <div className="order-details-card">
                        <h2 className="card-section-heading">Order Status</h2>
                        <div className="info-attribute-list">
                            <div className="attribute-row">
                                <span className="attr-label">Fulfillment Status</span>
                                <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="attribute-row">
                                <span className="attr-label">Payment Status</span>
                                <span className={`status-badge status-${order.paymentStatus?.toLowerCase()}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.razorpayPaymentId && (
                                <div className="attribute-row">
                                    <span className="attr-label">Payment ID</span>
                                    <span className="attr-val mono-text">{order.razorpayPaymentId}</span>
                                </div>
                            )}
                            {order.razorpayOrderId && (
                                <div className="attribute-row">
                                    <span className="attr-label">Razorpay Order</span>
                                    <span className="attr-val mono-text">{order.razorpayOrderId}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {order.shippingAddress && (
                        <div className="order-details-card">
                            <h2 className="card-section-heading">Shipping Address</h2>
                            <div className="shipping-address-display">
                                <strong className="shipping-name">{order.shippingAddress.fullName}</strong>
                                <p className="shipping-text">
                                    {order.shippingAddress.addressLine1}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                </p>
                                <p className="shipping-phone">📞 {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
};

export default OrderDetails;
