import { describe, it, expect } from "vitest";
import productReducer, {
    setSearchQuery,
    clearSelectedProduct,
    clearProductError,
    clearProductSuccess,
    fetchProducts
} from "./productSlice";

describe("productSlice reducers", () => {
    const initialState = {
        products: [],
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
        },
        searchQuery: "",
        selectedProduct: null,
        farmerProducts: [],
        loading: false,
        error: null,
        successMessage: null,
    };

    it("should return the initial state", () => {
        expect(productReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it("should set search query", () => {
        const nextState = productReducer(initialState, setSearchQuery("olive"));
        expect(nextState.searchQuery).toBe("olive");
    });

    it("should clear selected product", () => {
        const stateWithProduct = {
            ...initialState,
            selectedProduct: { id: 1, name: "Argan Oil" }
        };
        const nextState = productReducer(stateWithProduct, clearSelectedProduct());
        expect(nextState.selectedProduct).toBeNull();
    });

    it("should clear product error", () => {
        const stateWithError = {
            ...initialState,
            error: "Fetch failed"
        };
        const nextState = productReducer(stateWithError, clearProductError());
        expect(nextState.error).toBeNull();
    });

    it("should clear product success message", () => {
        const stateWithSuccess = {
            ...initialState,
            successMessage: "Created successfully"
        };
        const nextState = productReducer(stateWithSuccess, clearProductSuccess());
        expect(nextState.successMessage).toBeNull();
    });

    it("should set loading to true when fetchProducts is pending", () => {
        const action = { type: fetchProducts.pending.type };
        const nextState = productReducer(initialState, action);
        expect(nextState.loading).toBe(true);
        expect(nextState.error).toBeNull();
    });

    it("should set loading to false and populate products when fetchProducts is fulfilled with array", () => {
        const mockResponse = [
            { id: 1, name: "Argan Oil" },
            { id: 2, name: "Saffron Taliouine" }
        ];
        const action = {
            type: fetchProducts.fulfilled.type,
            payload: mockResponse
        };
        const nextState = productReducer(initialState, action);
        expect(nextState.loading).toBe(false);
        expect(nextState.products).toEqual(mockResponse);
        expect(nextState.pagination.totalItems).toBe(2);
        expect(nextState.pagination.totalPages).toBe(1);
    });

    it("should parse Laravel paginated response structure with meta", () => {
        const mockLaravelPayload = {
            data: [
                { id: 10, name: "Tomates Rondes", base_price: 5.5 },
                { id: 11, name: "Oranges Navel", base_price: 7.0 }
            ],
            meta: {
                current_page: 2,
                last_page: 4,
                total: 58,
                per_page: 15
            }
        };
        const action = {
            type: fetchProducts.fulfilled.type,
            payload: mockLaravelPayload,
            meta: { arg: { page: 2 } }
        };
        const nextState = productReducer(initialState, action);
        expect(nextState.loading).toBe(false);
        expect(nextState.products).toHaveLength(2);
        expect(nextState.pagination.currentPage).toBe(2);
        expect(nextState.pagination.totalPages).toBe(4);
        expect(nextState.pagination.totalItems).toBe(58);
    });
});
