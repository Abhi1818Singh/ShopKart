import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderByIdApi } from '../services/api';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await getOrderByIdApi(id);
                if (response.data.success) {
                    setOrder(response.data.order);
                } else {
                    setError(response.data.message || 'Order not found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load order confirmation');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <main className="page-container confirmation-page">
                <div className="state-container loading-state" id="confirmation-loading">
                    <div className="spinner" aria-hidden="true"></div>
                    <p className="state-message">Verifying order confirmation...</p>
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="page-container confirmation-page">
                <div className="state-container error-state" id="confirmation-error">
                    <div className="state-icon" aria-hidden="true">⚠️</div>
                    <h2 className="state-title">Unable to retrieve order</h2>
                    <p className="state-message">{error || 'Order could not be found'}</p>
                    <Link to="/orders" className="btn-retry">
                        View My Orders
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page-container confirmation-page">
            <div className="confirmation-card" id="confirmation-card">
                <div className="confirmation-icon-badge" aria-hidden="true">
                    ✅
                </div>
                <h1 className="confirmation-title">Order Placed Successfully!</h1>
                <p className="confirmation-submessage">
                    Thank you for shopping with us. Your order has been saved and confirmed.
                </p>

                <div className="confirmation-details-box">
                    <div className="confirm-row">
                        <span className="confirm-label">Order ID:</span>
                        <span className="confirm-value mono-text" id="confirm-order-id">{order._id}</span>
                    </div>

                    <div className="confirm-row">
                        <span className="confirm-label">Status:</span>
                        <span className="status-badge status-placed" id="confirm-order-status">{order.status}</span>
                    </div>

                    <div className="confirm-row">
                        <span className="confirm-label">Payment:</span>
                        <span className="status-badge status-paid" id="confirm-payment-status">{order.paymentStatus}</span>
                    </div>

                    <div className="confirm-row">
                        <span className="confirm-label">Total Amount:</span>
                        <span className="confirm-value confirm-total" id="confirm-order-total">
                            ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </span>
                    </div>

                    {order.shippingAddress && (
                        <div className="confirm-address-block">
                            <span className="confirm-label">Delivering To:</span>
                            <p className="confirm-address-text">
                                {order.shippingAddress.fullName} • {order.shippingAddress.phone}<br />
                                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                        </div>
                    )}
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="confirm-items-summary">
                        <h2 className="confirm-items-title">Items Ordered ({order.items.length})</h2>
                        <div className="confirm-items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="confirm-item-row">
                                    <span className="confirm-item-name">{item.name} × {item.quantity}</span>
                                    <span className="confirm-item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="confirmation-actions">
                    <Link to="/orders" className="btn-checkout" id="view-orders-btn">
                        View My Orders
                    </Link>
                    <Link to="/products" className="btn-continue-shopping-cart" id="continue-shopping-btn">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmation;
