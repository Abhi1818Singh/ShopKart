import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCartItems,
    selectCartSubtotal,
    clearCart
} from '../features/cart/cartSlice';
import { createPaymentOrderApi, verifyPaymentApi } from '../services/api';

const Checkout = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const subtotal = useSelector(selectCartSubtotal);

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [testPaymentModal, setTestPaymentModal] = useState(null);

    // If cart is empty, render empty state redirect prompt
    if (!cartItems || cartItems.length === 0) {
        return (
            <main className="page-container checkout-page">
                <div className="state-container empty-state" id="checkout-empty-state">
                    <div className="state-icon" aria-hidden="true">🛒</div>
                    <h2 className="state-title">Your cart is empty</h2>
                    <p className="state-submessage">Add some items to your cart before proceeding to checkout.</p>
                    <Link to="/products" className="btn-retry" id="checkout-browse-products-btn">
                        Browse Products
                    </Link>
                </div>
            </main>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress((prev) => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Client-side validation
    const validateForm = () => {
        const errors = {};

        if (!shippingAddress.fullName.trim()) {
            errors.fullName = 'Full Name is required';
        }

        if (!shippingAddress.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(shippingAddress.phone.trim())) {
            errors.phone = 'Phone should contain a valid 10-digit number';
        }

        if (!shippingAddress.addressLine1.trim()) {
            errors.addressLine1 = 'Address is required';
        }

        if (!shippingAddress.city.trim()) {
            errors.city = 'City is required';
        }

        if (!shippingAddress.state.trim()) {
            errors.state = 'State is required';
        }

        if (!shippingAddress.pincode.trim()) {
            errors.pincode = 'Pincode is required';
        } else if (!/^[0-9]{6}$/.test(shippingAddress.pincode.trim())) {
            errors.pincode = 'Pincode must contain 6 digits';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePaymentSuccess = async (paymentDetails, orderId) => {
        try {
            const verifyRes = await verifyPaymentApi(paymentDetails);
            if (verifyRes.data.success) {
                // Clear cart only after verified payment
                dispatch(clearCart());
                navigate(`/order-success/${orderId}`);
            } else {
                setServerError(verifyRes.data.message || 'Payment verification failed');
            }
        } catch (err) {
            setServerError(
                err.response?.data?.message || 'Payment verification failed. Please contact support.'
            );
        } finally {
            setIsSubmitting(false);
            setTestPaymentModal(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        // Step 1: Validate Form
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 2: Call create-payment-order API
            const response = await createPaymentOrderApi(shippingAddress);
            const data = response.data;

            if (!data.success) {
                setServerError(data.message || 'Failed to initialize order');
                setIsSubmitting(false);
                return;
            }

            const { orderId, razorpayOrderId, amount, currency, keyId } = data;

            // Check if Razorpay script is available in window
            if (typeof window.Razorpay === 'function' && !razorpayOrderId.startsWith('order_sim_')) {
                const options = {
                    key: keyId,
                    amount: amount,
                    currency: currency || 'INR',
                    name: 'ShopKart',
                    description: `Order #${orderId}`,
                    order_id: razorpayOrderId,
                    handler: async function (response) {
                        await handlePaymentSuccess({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature
                        }, orderId);
                    },
                    prefill: {
                        name: shippingAddress.fullName,
                        contact: shippingAddress.phone,
                        email: user?.email || ''
                    },
                    theme: {
                        color: '#6366f1'
                    },
                    modal: {
                        ondismiss: function () {
                            setIsSubmitting(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    setServerError(response.error?.description || 'Payment failed');
                    setIsSubmitting(false);
                });
                rzp.open();
            } else {
                // Razorpay Test Mode / Simulated Environment Modal
                setTestPaymentModal({
                    orderId,
                    razorpayOrderId,
                    amount,
                    currency
                });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to place order. Please try again.';
            setServerError(errorMsg);
            setIsSubmitting(false);
        }
    };

    const confirmSimulatedPayment = () => {
        if (!testPaymentModal) return;
        const simulatedPaymentId = `pay_sim_${Date.now()}`;
        handlePaymentSuccess({
            razorpayOrderId: testPaymentModal.razorpayOrderId,
            razorpayPaymentId: simulatedPaymentId,
            razorpaySignature: 'simulated_test_signature'
        }, testPaymentModal.orderId);
    };

    return (
        <main className="page-container checkout-page">
            <header className="checkout-hero-header">
                <span className="section-eyebrow">Final Step</span>
                <h1 className="checkout-main-title">Checkout</h1>
                <p className="checkout-subtitle">Enter your delivery address and complete your purchase</p>
            </header>

            {serverError && (
                <div className="checkout-error-banner" id="checkout-server-error" role="alert">
                    <span className="error-icon" aria-hidden="true">⚠️</span>
                    <span>{serverError}</span>
                </div>
            )}

            <div className="checkout-layout">
                {/* Shipping Details Form */}
                <section className="checkout-form-section" aria-label="Shipping Details">
                    <div className="checkout-card">
                        <h2 className="checkout-section-title">Shipping Details</h2>
                        <form id="shipping-form" onSubmit={handleSubmit} noValidate>
                            <div className="form-group">
                                <label htmlFor="fullName" className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    className={`form-input ${fieldErrors.fullName ? 'input-error' : ''}`}
                                    placeholder="e.g. Aarav Sharma"
                                    value={shippingAddress.fullName}
                                    onChange={handleChange}
                                />
                                {fieldErrors.fullName && (
                                    <span className="field-error" id="error-fullName">{fieldErrors.fullName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone" className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className={`form-input ${fieldErrors.phone ? 'input-error' : ''}`}
                                    placeholder="10-digit mobile number"
                                    value={shippingAddress.phone}
                                    onChange={handleChange}
                                />
                                {fieldErrors.phone && (
                                    <span className="field-error" id="error-phone">{fieldErrors.phone}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="addressLine1" className="form-label">Address *</label>
                                <input
                                    type="text"
                                    id="addressLine1"
                                    name="addressLine1"
                                    className={`form-input ${fieldErrors.addressLine1 ? 'input-error' : ''}`}
                                    placeholder="House/Flat No., Street, Area"
                                    value={shippingAddress.addressLine1}
                                    onChange={handleChange}
                                />
                                {fieldErrors.addressLine1 && (
                                    <span className="field-error" id="error-addressLine1">{fieldErrors.addressLine1}</span>
                                )}
                            </div>

                            <div className="form-row-two">
                                <div className="form-group">
                                    <label htmlFor="city" className="form-label">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className={`form-input ${fieldErrors.city ? 'input-error' : ''}`}
                                        placeholder="City"
                                        value={shippingAddress.city}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.city && (
                                        <span className="field-error" id="error-city">{fieldErrors.city}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state" className="form-label">State *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        className={`form-input ${fieldErrors.state ? 'input-error' : ''}`}
                                        placeholder="State"
                                        value={shippingAddress.state}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.state && (
                                        <span className="field-error" id="error-state">{fieldErrors.state}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="pincode" className="form-label">Pincode *</label>
                                <input
                                    type="text"
                                    id="pincode"
                                    name="pincode"
                                    maxLength="6"
                                    className={`form-input ${fieldErrors.pincode ? 'input-error' : ''}`}
                                    placeholder="6-digit pincode"
                                    value={shippingAddress.pincode}
                                    onChange={handleChange}
                                />
                                {fieldErrors.pincode && (
                                    <span className="field-error" id="error-pincode">{fieldErrors.pincode}</span>
                                )}
                            </div>
                        </form>
                    </div>
                </section>

                {/* Order Summary & Place Order */}
                <aside className="checkout-summary-section" aria-label="Order Summary">
                    <div className="order-summary-card">
                        <h2 className="order-summary-title">Order Summary</h2>

                        <div className="checkout-items-list" id="checkout-items-list">
                            {cartItems.map((item) => (
                                <div key={item.product?._id} className="checkout-item-row">
                                    <div className="checkout-item-info">
                                        <span className="checkout-item-name">{item.product?.name}</span>
                                        <span className="checkout-item-qty">× {item.quantity}</span>
                                    </div>
                                    <span className="checkout-item-price">
                                        ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary-divider"></div>

                        <div className="summary-row summary-total-row">
                            <span className="summary-label total-label">Total</span>
                            <span className="summary-value summary-total-value">
                                ₹{subtotal.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <button
                            type="button"
                            form="shipping-form"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="btn-checkout btn-place-order"
                            id="place-order-btn"
                        >
                            {isSubmitting ? (
                                <span className="btn-loading-flex">
                                    <span className="mini-spinner" aria-hidden="true"></span>
                                    Processing Payment...
                                </span>
                            ) : (
                                `Place Order (₹${subtotal.toLocaleString('en-IN')})`
                            )}
                        </button>

                        <p className="checkout-security-notice">
                            🔒 Razorpay Test Mode Secured Payment. No real money is charged.
                        </p>

                        <Link to="/cart" className="btn-continue-shopping-cart">
                            ← Return to Cart
                        </Link>
                    </div>
                </aside>
            </div>

            {/* Test Mode Simulator Modal */}
            {testPaymentModal && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-card">
                        <div className="modal-header">
                            <h3 className="modal-title">💳 Razorpay Test Mode Simulator</h3>
                        </div>
                        <div className="modal-body">
                            <p className="modal-desc">
                                Test order created successfully! Simulate completing the payment in Razorpay Test Mode:
                            </p>
                            <div className="modal-info-box">
                                <div><strong>Order ID:</strong> {testPaymentModal.orderId}</div>
                                <div><strong>Razorpay Order:</strong> {testPaymentModal.razorpayOrderId}</div>
                                <div><strong>Amount:</strong> ₹{(testPaymentModal.amount / 100).toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="btn-checkout"
                                onClick={confirmSimulatedPayment}
                                id="simulate-success-btn"
                            >
                                ✅ Simulate Successful Payment
                            </button>
                            <button
                                type="button"
                                className="btn-logout"
                                onClick={() => {
                                    setTestPaymentModal(null);
                                    setIsSubmitting(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Checkout;
