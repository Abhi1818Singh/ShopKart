import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8008',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const registerCustomer = (data) => api.post('/customers/register', data);
export const loginCustomer = (data) => api.post('/customers/login', data);
export const getProfile = () => api.get('/customers/me');
export const logoutCustomer = () => api.post('/customers/logout');

// Products API
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);

// Wishlist API
export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const getWishlist = () => api.get('/wishlist');
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

// Cart API
export const addToCartApi = (productId) => api.post(`/cart/${productId}`);
export const getCartApi = () => api.get('/cart');
export const updateCartQuantityApi = (productId, quantity) => api.patch(`/cart/${productId}`, { quantity });
export const removeFromCartApi = (productId) => api.delete(`/cart/${productId}`);

// Orders API
export const createPaymentOrderApi = (shippingAddress) => api.post('/orders/create-payment-order', { shippingAddress });
export const verifyPaymentApi = (paymentData) => api.post('/orders/verify-payment', paymentData);
export const getOrdersApi = () => api.get('/orders');
export const getOrderByIdApi = (id) => api.get(`/orders/${id}`);

export default api;
