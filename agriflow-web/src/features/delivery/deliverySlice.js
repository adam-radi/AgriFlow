import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deliveryAPI } from "./deliveryApi";

function unwrap(res) {
    return res.data?.data ?? res.data;
}

export const fetchDeliveryGroups = createAsyncThunk(
    "delivery/fetchGroups",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await deliveryAPI.getGroups(params);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load delivery groups");
        }
    }
);

export const createDeliveryGroup = createAsyncThunk(
    "delivery/createGroup",
    async (data, { rejectWithValue }) => {
        try {
            const res = await deliveryAPI.createGroup(data);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create delivery group");
        }
    }
);

export const assignLivreurToGroup = createAsyncThunk(
    "delivery/assignLivreur",
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const res = await deliveryAPI.assignLivreur(id, userId);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to assign livreur");
        }
    }
);

export const updateDeliveryStatus = createAsyncThunk(
    "delivery/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await deliveryAPI.updateStatus(id, status);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update status");
        }
    }
);

export const fetchDeliveryGroupDetails = createAsyncThunk(
    "delivery/fetchDetails",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deliveryAPI.getGroupById(id);
            return unwrap(res);
        } catch (err) {
            return rejectWithValue(err.response?.data || "Group not found");
        }
    }
);

const initialState = {
    groups: [],
    selectedGroup: null,
    loading: false,
    error: null,
    success: null,
    filters: {
        zone: null,
        status: null,
        date: null,
    },
};

const deliverySlice = createSlice({
    name: "delivery",
    initialState,
    reducers: {
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearSelectedGroup: (state) => {
            state.selectedGroup = null;
        },
        clearDeliveryError: (state) => {
            state.error = null;
        },
        clearDeliverySuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDeliveryGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDeliveryGroups.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.groups = Array.isArray(data) ? data : data.results ?? data.groups ?? [];
            })
            .addCase(fetchDeliveryGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(fetchDeliveryGroupDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedGroup = null;
            })
            .addCase(fetchDeliveryGroupDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedGroup = action.payload;
            })
            .addCase(fetchDeliveryGroupDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(createDeliveryGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createDeliveryGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups.unshift(action.payload);
                state.success = "Delivery group created!";
            })
            .addCase(createDeliveryGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(assignLivreurToGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignLivreurToGroup.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.groups.findIndex((g) => g.id === updated.id);
                if (idx !== -1) state.groups[idx] = updated;
                if (state.selectedGroup?.id === updated.id) state.selectedGroup = updated;
                state.success = "Livreur assigned!";
            })
            .addCase(assignLivreurToGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateDeliveryStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.groups.findIndex((g) => g.id === updated.id);
                if (idx !== -1) state.groups[idx] = updated;
                if (state.selectedGroup?.id === updated.id) state.selectedGroup = updated;
                state.success = "Status updated!";
            })
            .addCase(updateDeliveryStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setSelectedGroup,
    setFilters,
    clearSelectedGroup,
    clearDeliveryError,
    clearDeliverySuccess,
} = deliverySlice.actions;

export default deliverySlice.reducer;
