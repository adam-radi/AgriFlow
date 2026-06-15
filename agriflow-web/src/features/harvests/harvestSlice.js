import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { harvestAPI } from "./harvestApi";
import { mockHarvests } from "../../api/mockData";

export const fetchHarvests = createAsyncThunk(
    "harvests/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getAll(params);
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.harvests?.length > 0);
            if (!hasData) {
                return mockHarvests;
            }
            return data;
        } catch (err) {
            console.warn("API harvests call failed, falling back to mockHarvests:", err);
            return mockHarvests;
        }
    }
);

export const fetchHarvestById = createAsyncThunk(
    "harvests/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getById(id);
            return res.data;
        } catch (err) {
            console.warn(`API harvest detail call failed for id ${id}, falling back to mockHarvests:`, err);
            const found = mockHarvests.find(h => h.id === parseInt(id) || h.id === id);
            if (found) return found;
            return rejectWithValue(err.response?.data || "Harvest not found");
        }
    }
);

export const fetchFarmerHarvests = createAsyncThunk(
    "harvests/fetchFarmerHarvests",
    async (_, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getFarmerHarvests();
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.harvests?.length > 0);
            if (!hasData) {
                return mockHarvests;
            }
            return data;
        } catch (err) {
            console.warn("API farmer harvests call failed, falling back to mockHarvests:", err);
            return mockHarvests;
        }
    }
);

export const createHarvest = createAsyncThunk(
    "harvests/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.create(data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create harvest");
        }
    }
);

export const updateHarvest = createAsyncThunk(
    "harvests/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.update(id, data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update harvest");
        }
    }
);

export const deleteHarvest = createAsyncThunk(
    "harvests/delete",
    async (id, { rejectWithValue }) => {
        try {
            await harvestAPI.delete(id);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete harvest");
        }
    }
);

export const fetchHarvestForecast = createAsyncThunk(
    "harvests/fetchForecast",
    async (id, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getForecast(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load forecast");
        }
    }
);

export const fetchHarvestOrders = createAsyncThunk(
    "harvests/fetchOrders",
    async (id, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getOrders(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load orders");
        }
    }
);

export const fetchAdminHarvests = createAsyncThunk(
    "harvests/fetchAdminHarvests",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await harvestAPI.getAdminHarvests(params);
            const data = res.data;
            const hasData = Array.isArray(data) ? data.length > 0 : (data.results?.length > 0 || data.harvests?.length > 0);
            if (!hasData) {
                return mockHarvests;
            }
            return data;
        } catch (err) {
            console.warn("API admin harvests call failed, falling back to mockHarvests:", err);
            return mockHarvests;
        }
    }
);

const initialState = {
    harvests: [],
    selectedHarvest: null,
    farmerHarvests: [],
    adminHarvests: [],
    forecast: null,
    orders: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    },
    filters: {
        search: "",
        status: "",
    },
    loading: false,
    error: null,
    successMessage: null,
};

const harvestSlice = createSlice({
    name: "harvests",
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearSelectedHarvest: (state) => {
            state.selectedHarvest = null;
            state.forecast = null;
            state.orders = [];
        },
        clearHarvestError: (state) => {
            state.error = null;
        },
        clearHarvestSuccess: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHarvests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHarvests.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                if (Array.isArray(data)) {
                    state.harvests = data;
                } else {
                    state.harvests = data.results ?? data.harvests ?? [];
                    state.pagination.totalItems = data.count ?? data.total ?? state.harvests.length;
                    state.pagination.totalPages = data.total_pages ?? Math.ceil(state.pagination.totalItems / 10);
                }
            })
            .addCase(fetchHarvests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchHarvestById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedHarvest = null;
            })
            .addCase(fetchHarvestById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedHarvest = action.payload;
            })
            .addCase(fetchHarvestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchFarmerHarvests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFarmerHarvests.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.farmerHarvests = Array.isArray(data)
                    ? data
                    : data.results ?? data.harvests ?? [];
            })
            .addCase(fetchFarmerHarvests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(createHarvest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createHarvest.fulfilled, (state, action) => {
                state.loading = false;
                state.farmerHarvests.unshift(action.payload);
                state.successMessage = "Harvest created successfully!";
            })
            .addCase(createHarvest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateHarvest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateHarvest.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.farmerHarvests.findIndex((h) => h.id === updated.id);
                if (idx !== -1) state.farmerHarvests[idx] = updated;
                if (state.selectedHarvest?.id === updated.id) state.selectedHarvest = updated;
                state.successMessage = "Harvest updated successfully!";
            })
            .addCase(updateHarvest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteHarvest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteHarvest.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.farmerHarvests = state.farmerHarvests.filter((h) => h.id !== deletedId);
                state.harvests = state.harvests.filter((h) => h.id !== deletedId);
                state.adminHarvests = state.adminHarvests.filter((h) => h.id !== deletedId);
                state.successMessage = "Harvest deleted.";
            })
            .addCase(deleteHarvest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchHarvestForecast.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHarvestForecast.fulfilled, (state, action) => {
                state.loading = false;
                state.forecast = action.payload;
            })
            .addCase(fetchHarvestForecast.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchHarvestOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHarvestOrders.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.orders = Array.isArray(data) ? data : data.results ?? data.orders ?? [];
            })
            .addCase(fetchHarvestOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchAdminHarvests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminHarvests.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.adminHarvests = Array.isArray(data)
                    ? data
                    : data.results ?? data.harvests ?? [];
                if (!Array.isArray(data)) {
                    state.pagination.totalItems = data.count ?? data.total ?? state.adminHarvests.length;
                    state.pagination.totalPages = data.total_pages ?? Math.ceil(state.pagination.totalItems / 10);
                }
            })
            .addCase(fetchAdminHarvests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setFilters,
    clearSelectedHarvest,
    clearHarvestError,
    clearHarvestSuccess,
} = harvestSlice.actions;

export default harvestSlice.reducer;
