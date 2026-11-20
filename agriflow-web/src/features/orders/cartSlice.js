import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from "./cartApi";

function unwrapData(res) {
    return res.data?.data ?? res.data;
}

export const fetchCart = createAsyncThunk(
    "cart/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await cartAPI.getCart();
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load cart");
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/add",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await cartAPI.addItem(payload);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to add item");
        }
    }
);

export const updateCartItem = createAsyncThunk(
    "cart/update",
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const res = await cartAPI.updateItem(itemId, quantity);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update cart");
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/remove",
    async (itemId, { rejectWithValue }) => {
        try {
            const res = await cartAPI.removeItem(itemId);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to remove item");
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clear",
    async (_, { rejectWithValue }) => {
        try {
            const res = await cartAPI.clearCart();
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to clear cart");
        }
    }
);

const initialState = {
    cart: null,
    items: [],
    total: 0,
    count: 0,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const handleFulfilled = (state, action) => {
            state.loading = false;
            const data = action.payload;
            state.cart = data;
            state.items = data?.items ?? [];
            state.total = data?.total ?? 0;
            state.count = data?.count ?? 0;
        };

        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, handleFulfilled)
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, handleFulfilled)
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, handleFulfilled)
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, handleFulfilled)
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, handleFulfilled)
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
