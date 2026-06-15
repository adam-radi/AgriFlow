// productSlice.js — Redux state manager for all product-related data.
// Thunks follow the same pattern as authThunks.js (createAsyncThunk + rejectWithValue).

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "./productApi";

// ─── ASYNC THUNKS ─────────────────────────────────────────────────────────────

/** Fetch public product catalog (supports pagination + search) */
export const fetchProducts = createAsyncThunk(
    "products/fetchAll",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await productAPI.getAll(params);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load products");
        }
    }
);

/** Fetch single product by ID */
export const fetchProductById = createAsyncThunk(
    "products/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await productAPI.getById(id);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Product not found");
        }
    }
);

/** Fetch the authenticated farmer's own products */
export const fetchFarmerProducts = createAsyncThunk(
    "products/fetchFarmerProducts",
    async (_, { rejectWithValue }) => {
        try {
            const res = await productAPI.getFarmerProducts();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to load your products");
        }
    }
);

/** Create a new product (farmer only) */
export const createProduct = createAsyncThunk(
    "products/create",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await productAPI.create(formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to create product");
        }
    }
);

/** Update an existing product (farmer only) */
export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await productAPI.update(id, formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to update product");
        }
    }
);

/** Delete a product (farmer only) */
export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id, { rejectWithValue }) => {
        try {
            await productAPI.delete(id);
            return id; // return id so we can remove it from state
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to delete product");
        }
    }
);

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

const initialState = {
    // Public catalog
    products: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    },
    searchQuery: "",

    // Product detail
    selectedProduct: null,

    // Farmer management
    farmerProducts: [],

    // UI state
    loading: false,
    error: null,
    successMessage: null,
};

// ─── SLICE ────────────────────────────────────────────────────────────────────

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
        clearProductError: (state) => {
            state.error = null;
        },
        clearProductSuccess: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {

        // ── fetchProducts ───────────────────────────────────────────────────
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                // Support both paginated { results, count } and plain array responses
                const data = action.payload;
                if (Array.isArray(data)) {
                    state.products = data;
                } else {
                    state.products = data.results ?? data.products ?? [];
                    state.pagination.totalItems = data.count ?? data.total ?? state.products.length;
                    state.pagination.totalPages = data.total_pages ?? Math.ceil(state.pagination.totalItems / 10);
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── fetchProductById ────────────────────────────────────────────────
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedProduct = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── fetchFarmerProducts ─────────────────────────────────────────────
        builder
            .addCase(fetchFarmerProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.farmerProducts = Array.isArray(data)
                    ? data
                    : data.results ?? data.products ?? [];
            })
            .addCase(fetchFarmerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── createProduct ───────────────────────────────────────────────────
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.farmerProducts.unshift(action.payload);
                state.successMessage = "Product created successfully!";
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── updateProduct ───────────────────────────────────────────────────
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const idx = state.farmerProducts.findIndex((p) => p.id === updated.id);
                if (idx !== -1) state.farmerProducts[idx] = updated;
                if (state.selectedProduct?.id === updated.id) state.selectedProduct = updated;
                state.successMessage = "Product updated successfully!";
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // ── deleteProduct ───────────────────────────────────────────────────
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.farmerProducts = state.farmerProducts.filter((p) => p.id !== deletedId);
                state.products = state.products.filter((p) => p.id !== deletedId);
                state.successMessage = "Product deleted.";
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setSearchQuery,
    clearSelectedProduct,
    clearProductError,
    clearProductSuccess,
} = productSlice.actions;

export default productSlice.reducer;
