import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "./orderApi";
import { mockOrders } from "../../api/mockData";

export const createOrder = createAsyncThunk(
    "orders/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await orderAPI.createOrder(payload);
            return res.data;
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
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.orders?.length > 0);
            if (!hasData) {
                return mockOrders;
            }
            return data;
        } catch (err) {
            console.warn("API orders call failed, falling back to mockOrders:", err);
            return mockOrders;
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    "orders/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getOrder(id);
            return res.data;
        } catch (err) {
            console.warn(`API order detail call failed for id ${id}, falling back to mockOrders:`, err);
            const found = mockOrders.find(o => o.id === parseInt(id) || o.id === id);
            if (found) return found;
            return rejectWithValue(err.response?.data || "Order not found");
        }
    }
);

export const fetchFarmerOrders = createAsyncThunk(
    "orders/fetchFarmerOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getFarmerOrders();
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.orders?.length > 0);
            if (!hasData) {
                return mockOrders;
            }
            return data;
        } catch (err) {
            console.warn("API farmer orders call failed, falling back to mockOrders:", err);
            return mockOrders;
        }
    }
);

export const fetchAdminOrders = createAsyncThunk(
    "orders/fetchAdminOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await orderAPI.getAdminOrders();
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.orders?.length > 0);
            if (!hasData) {
                return mockOrders;
            }
            return data;
        } catch (err) {
            console.warn("API admin orders call failed, falling back to mockOrders:", err);
            return mockOrders;
        }
    }
);

const loadCart = () => {
    try {
        const data = localStorage.getItem("agriflow_cart");
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
};

const saveCart = (items) => {
    try {
        localStorage.setItem("agriflow_cart", JSON.stringify(items));
    } catch { /* ignore */ }
};

const initialState = {
    cartItems: loadCart(),
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
        addToCart: (state, action) => {
            const item = action.payload;
            const idx = state.cartItems.findIndex(
                (i) => i.productId === item.productId && i.harvestId === item.harvestId
            );
            if (idx !== -1) {
                state.cartItems[idx].packQuantity += item.packQuantity;
                state.cartItems[idx].totalWeight =
                    state.cartItems[idx].standardQuantity * state.cartItems[idx].packQuantity;
                state.cartItems[idx].subtotal =
                    state.cartItems[idx].unitPrice * state.cartItems[idx].totalWeight;
            } else {
                state.cartItems.push(item);
            }
            saveCart(state.cartItems);
        },
        removeFromCart: (state, action) => {
            const { productId, harvestId } = action.payload;
            state.cartItems = state.cartItems.filter(
                (i) => !(i.productId === productId && i.harvestId === harvestId)
            );
            saveCart(state.cartItems);
        },
        updatePackQuantity: (state, action) => {
            const { productId, harvestId, packQuantity } = action.payload;
            const item = state.cartItems.find(
                (i) => i.productId === productId && i.harvestId === harvestId
            );
            if (item) {
                item.packQuantity = Math.max(1, packQuantity);
                item.totalWeight = item.standardQuantity * item.packQuantity;
                item.subtotal = item.unitPrice * item.totalWeight;
            }
            saveCart(state.cartItems);
        },
        clearCart: (state) => {
            state.cartItems = [];
            saveCart(state.cartItems);
        },
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
                state.cartItems = [];
                saveCart(state.cartItems);
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
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? [];
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
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? [];
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
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? [];
            })
            .addCase(fetchAdminOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    addToCart,
    removeFromCart,
    updatePackQuantity,
    clearCart,
    clearOrderError,
    clearOrderSuccess,
} = orderSlice.actions;

export default orderSlice.reducer;
