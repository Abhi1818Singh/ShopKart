import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addToCartApi, getCartApi, updateCartQuantityApi, removeFromCartApi } from '../../services/api';

// Async thunks
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCartApi();
            return response.data.cart;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to load cart'
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await addToCartApi(productId);
            return response.data.cart;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to add to cart'
            );
        }
    }
);

export const updateQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await updateCartQuantityApi(productId, quantity);
            return response.data.cart;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to update quantity'
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await removeFromCartApi(productId);
            return response.data.cart;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Failed to remove from cart'
            );
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
        // Track loading states for individual product actions
        addingProducts: {},   // { [productId]: true/false }
        updatingProducts: {}, // { [productId]: true/false }
        removingProducts: {}, // { [productId]: true/false }
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
            state.loading = false;
            state.error = null;
            state.addingProducts = {};
            state.updatingProducts = {};
            state.removingProducts = {};
        },
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add to cart
            .addCase(addToCart.pending, (state, action) => {
                state.addingProducts[action.meta.arg] = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.addingProducts[action.meta.arg] = false;
                state.items = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.addingProducts[action.meta.arg] = false;
                state.error = action.payload;
            })

            // Update quantity
            .addCase(updateQuantity.pending, (state, action) => {
                state.updatingProducts[action.meta.arg.productId] = true;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.updatingProducts[action.meta.arg.productId] = false;
                state.items = action.payload;
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.updatingProducts[action.meta.arg.productId] = false;
                state.error = action.payload;
            })

            // Remove from cart
            .addCase(removeFromCart.pending, (state, action) => {
                state.removingProducts[action.meta.arg] = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.removingProducts[action.meta.arg] = false;
                state.items = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.removingProducts[action.meta.arg] = false;
                state.error = action.payload;
            });
    },
});

export const { clearCart, clearCartError } = cartSlice.actions;

// Selectors — derived values calculated from state, never stored in MongoDB
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotalQuantity = (state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state) =>
    state.cart.items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0
    );

export const selectIsProductInCart = (state, productId) =>
    state.cart.items.some((item) => item.product?._id === productId);

export const selectIsAddingProduct = (state, productId) =>
    !!state.cart.addingProducts[productId];

export const selectIsUpdatingProduct = (state, productId) =>
    !!state.cart.updatingProducts[productId];

export const selectIsRemovingProduct = (state, productId) =>
    !!state.cart.removingProducts[productId];

export default cartSlice.reducer;
