import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateQuantity,
    removeFromCart,
    selectIsUpdatingProduct,
    selectIsRemovingProduct
} from '../features/cart/cartSlice';

const CartItem = ({ item }) => {
    const dispatch = useDispatch();
    const { product, quantity } = item;

    const isUpdating = useSelector((state) => selectIsUpdatingProduct(state, product._id));
    const isRemoving = useSelector((state) => selectIsRemovingProduct(state, product._id));

    const formattedPrice = `₹${Number(product.price).toLocaleString('en-IN')}`;
    const lineTotal = `₹${(product.price * quantity).toLocaleString('en-IN')}`;

    const handleIncrease = () => {
        if (isUpdating || quantity >= product.stock) return;
        dispatch(updateQuantity({ productId: product._id, quantity: quantity + 1 }));
    };

    const handleDecrease = () => {
        if (isUpdating || quantity <= 1) return;
        dispatch(updateQuantity({ productId: product._id, quantity: quantity - 1 }));
    };

    const handleRemove = () => {
        if (isRemoving) return;
        dispatch(removeFromCart(product._id));
    };

    return (
        <div className={`cart-item ${isRemoving ? 'cart-item-removing' : ''}`} id={`cart-item-${product._id}`}>
            <div className="cart-item-image-wrap">
                <img
                    src={product.image}
                    alt={product.name}
                    className="cart-item-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60';
                    }}
                />
            </div>

            <div className="cart-item-details">
                <div className="cart-item-info">
                    <h3 className="cart-item-name">{product.name}</h3>
                    <span className="cart-item-category">{product.category}</span>
                    <span className="cart-item-unit-price">{formattedPrice}</span>
                </div>

                <div className="cart-item-controls">
                    <div className="quantity-controls">
                        <button
                            type="button"
                            className="qty-btn qty-decrease"
                            onClick={handleDecrease}
                            disabled={isUpdating || quantity <= 1}
                            aria-label="Decrease quantity"
                            id={`qty-decrease-${product._id}`}
                        >
                            −
                        </button>
                        <span className="qty-value" id={`qty-value-${product._id}`}>
                            {isUpdating ? '...' : quantity}
                        </span>
                        <button
                            type="button"
                            className="qty-btn qty-increase"
                            onClick={handleIncrease}
                            disabled={isUpdating || quantity >= product.stock}
                            aria-label="Increase quantity"
                            id={`qty-increase-${product._id}`}
                        >
                            +
                        </button>
                    </div>

                    {quantity >= product.stock && (
                        <span className="stock-limit-msg">Max stock reached</span>
                    )}
                </div>

                <div className="cart-item-line-total">
                    <span className="line-total-label">Subtotal</span>
                    <span className="line-total-value">{lineTotal}</span>
                </div>

                <button
                    type="button"
                    className="btn-remove-cart"
                    onClick={handleRemove}
                    disabled={isRemoving}
                    id={`remove-cart-${product._id}`}
                >
                    {isRemoving ? 'Removing...' : '✕ Remove'}
                </button>
            </div>
        </div>
    );
};

export default CartItem;
