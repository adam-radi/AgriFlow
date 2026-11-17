import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "./orderApi";

function unwrapData(res) {
    return res.data?.data ?? res.data;
}

export const createOrder = createAsyncThunk(
    "orders/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await orderAPI.createOrder(payload);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create order");
        }
    }
);

export const fetchOrders = createAsyncThunk(
    "orders/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getOrders();
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load orders");
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    "orders/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getOrder(id);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Order not found");
        }
    }
);

export const fetchFarmerOrders = createAsyncThunk(
    "orders/fetchFarmerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getFarmerOrders();
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load farmer orders");
        }
    }
);

export const fetchAdminOrders = createAsyncThunk(
    "orders/fetchAdminOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getAdminOrders();
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load admin orders");
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: null,
};

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        clearOrderError: (state) => {
            state.error = null;
        },
        clearOrderSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.unshift(action.payload);
                state.currentOrder = action.payload;
                state.success = "Order placed successfully!";
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? data.data ?? [];
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchFarmerOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? data.data ?? [];
            })
            .addCase(fetchFarmerOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAdminOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminOrders.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? data.data ?? [];
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderError, clearOrderSuccess } = orderSlice.actions;

export default orderSlice.reducer;
