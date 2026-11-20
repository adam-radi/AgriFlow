import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from "./adminApi";

function unwrap(res) {
    return res.data?.data ?? res.data;
}

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getUsers(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load users");
        }
    }
);

export const fetchFarmers = createAsyncThunk(
    "admin/fetchFarmers",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getFarmers(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load farmers");
        }
    }
);

export const fetchProducts = createAsyncThunk(
    "admin/fetchProducts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getProducts(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load products");
        }
    }
);

export const fetchOrders = createAsyncThunk(
    "admin/fetchOrders",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getOrders(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load orders");
        }
    }
);

export const fetchHarvests = createAsyncThunk(
    "admin/fetchHarvests",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getHarvests(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load harvests");
        }
    }
);

export const fetchStats = createAsyncThunk(
    "admin/fetchStats",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await adminAPI.getStats(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load stats");
        }
    }
);

export const validateFarmer = createAsyncThunk(
    "admin/validateFarmer",
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminAPI.validateFarmer(id);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to validate farmer");
        }
    }
);

export const rejectFarmer = createAsyncThunk(
    "admin/rejectFarmer",
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminAPI.rejectFarmer(id);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to reject farmer");
        }
    }
);

export const suspendUser = createAsyncThunk(
    "admin/suspendUser",
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminAPI.suspendUser(id);
            return { id, data: unwrap(res) };
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to suspend user");
        }
    }
);

export const disableProduct = createAsyncThunk(
    "admin/disableProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminAPI.disableProduct(id);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to disable product");
        }
    }
);

export const enableProduct = createAsyncThunk(
    "admin/enableProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await adminAPI.enableProduct(id);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to enable product");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "admin/updateProduct",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await adminAPI.updateProduct(id, data);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update product");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "admin/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            await adminAPI.deleteProduct(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete product");
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "admin/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await adminAPI.updateOrderStatus(id, status);
            return res.data?.data ?? res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update order");
        }
    }
);

export const createDeliveryUser = createAsyncThunk(
    "admin/createDeliveryUser",
    async (data, { rejectWithValue }) => {
        try {
            const res = await adminAPI.createDeliveryUser(data);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create delivery user");
        }
    }
);

const initialState = {
    users: [],
    farmers: [],
    products: [],
    orders: [],
    harvests: [],
    stats: {},
    loading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const setPending = (state) => {
            state.loading = true;
            state.error = null;
        };
        const setRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };

        builder
            .addCase(fetchUsers.pending, setPending)
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = Array.isArray(action.payload) ? action.payload : action.payload.data ?? action.payload.results ?? action.payload.users ?? [];
            })
            .addCase(fetchUsers.rejected, setRejected);

        builder
            .addCase(fetchFarmers.pending, setPending)
            .addCase(fetchFarmers.fulfilled, (state, action) => {
                state.loading = false;
                state.farmers = Array.isArray(action.payload) ? action.payload : action.payload.data ?? action.payload.results ?? action.payload.farmers ?? [];
            })
            .addCase(fetchFarmers.rejected, setRejected);

        builder
            .addCase(fetchProducts.pending, setPending)
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = Array.isArray(action.payload) ? action.payload : action.payload.data ?? action.payload.results ?? action.payload.products ?? [];
            })
            .addCase(fetchProducts.rejected, setRejected);

        builder
            .addCase(fetchOrders.pending, setPending)
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = Array.isArray(action.payload) ? action.payload : action.payload.data ?? action.payload.results ?? action.payload.orders ?? [];
            })
            .addCase(fetchOrders.rejected, setRejected);

        builder
            .addCase(fetchHarvests.pending, setPending)
            .addCase(fetchHarvests.fulfilled, (state, action) => {
                state.loading = false;
                state.harvests = Array.isArray(action.payload) ? action.payload : action.payload.data ?? action.payload.results ?? action.payload.harvests ?? [];
            })
            .addCase(fetchHarvests.rejected, setRejected);

        builder
            .addCase(fetchStats.pending, setPending)
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload ?? {};
            })
            .addCase(fetchStats.rejected, setRejected);

        builder
            .addCase(validateFarmer.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.farmers.findIndex((f) => f.id === updated.id);
                if (idx !== -1) state.farmers[idx] = updated;
            });

        builder
            .addCase(rejectFarmer.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.farmers.findIndex((f) => f.id === updated.id);
                if (idx !== -1) state.farmers[idx] = updated;
            });

        builder
            .addCase(suspendUser.fulfilled, (state, action) => {
                state.users = state.users.filter((u) => u.id !== action.payload?.id);
            });

        builder
            .addCase(disableProduct.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.products.findIndex((p) => p.id === updated.id);
                if (idx !== -1) state.products[idx] = updated;
            });

        builder
            .addCase(enableProduct.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.products.findIndex((p) => p.id === updated.id);
                if (idx !== -1) state.products[idx] = updated;
            });

        builder
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.products.findIndex((p) => p.id === updated.id);
                if (idx !== -1) state.products[idx] = updated;
            });

        builder
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter((p) => p.id !== action.payload);
            });

        builder
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const updated = action.payload;
                const idx = state.orders.findIndex((o) => o.id === updated.id);
                if (idx !== -1) state.orders[idx] = updated;
            });

        builder
            .addCase(createDeliveryUser.fulfilled, (state) => {
                state.loading = false;
            });
    },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;
