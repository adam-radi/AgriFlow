import { describe, it, expect } from "vitest";
import productReducer, {
  fetchFarmerProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearProductSuccess,
  clearProductError,
} from "./productSlice";
import {
  selectFarmerProducts,
  selectProductsLoading,
  selectProductsSuccess,
} from "./productSelectors";

describe("Phase 09: Farmer Product Management Reducer & Selectors", () => {
  const baseState = {
    products: [],
    pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
    searchQuery: "",
    selectedProduct: null,
    farmerProducts: [],
    loading: false,
    error: null,
    successMessage: null,
  };

  it("should populate farmerProducts on fetchFarmerProducts.fulfilled", () => {
    const mockFarmerProducts = [
      { id: 1, name: "Tomates Bio", base_price: 12, is_available: true },
      { id: 2, name: "Olives Picholine", base_price: 45, is_available: true },
    ];

    const action = {
      type: fetchFarmerProducts.fulfilled.type,
      payload: mockFarmerProducts,
    };

    const nextState = productReducer(baseState, action);
    expect(nextState.farmerProducts).toHaveLength(2);
    expect(nextState.farmerProducts[0].name).toBe("Tomates Bio");
    expect(selectFarmerProducts({ products: nextState })).toEqual(mockFarmerProducts);
    expect(selectProductsLoading({ products: nextState })).toBe(false);
  });

  it("should prepend new product on createProduct.fulfilled and set success message", () => {
    const existingState = {
      ...baseState,
      farmerProducts: [{ id: 1, name: "Tomates Bio" }],
    };

    const newProduct = {
      id: 2,
      name: "Oranges Navel",
      base_price: 9,
      quantities: [{ label: "Caisse 15kg", price: 135 }],
    };

    const action = {
      type: createProduct.fulfilled.type,
      payload: newProduct,
    };

    const nextState = productReducer(existingState, action);
    expect(nextState.farmerProducts).toHaveLength(2);
    expect(nextState.farmerProducts[0].name).toBe("Oranges Navel");
    expect(selectProductsSuccess({ products: nextState })).toBe("Product created successfully!");
  });

  it("should update existing product in farmerProducts on updateProduct.fulfilled", () => {
    const existingState = {
      ...baseState,
      farmerProducts: [
        { id: 1, name: "Tomates Rondes", base_price: 10 },
        { id: 2, name: "Olives Vertes", base_price: 40 },
      ],
      selectedProduct: { id: 1, name: "Tomates Rondes", base_price: 10 },
    };

    const updatedProduct = {
      id: 1,
      name: "Tomates Rondes Primeur",
      base_price: 12,
      quantities: [{ label: "Plateau 6kg", price: 72 }],
    };

    const action = {
      type: updateProduct.fulfilled.type,
      payload: updatedProduct,
    };

    const nextState = productReducer(existingState, action);
    expect(nextState.farmerProducts[0].name).toBe("Tomates Rondes Primeur");
    expect(nextState.farmerProducts[0].base_price).toBe(12);
    expect(nextState.selectedProduct.name).toBe("Tomates Rondes Primeur");
    expect(selectProductsSuccess({ products: nextState })).toBe("Product updated successfully!");
  });

  it("should remove deleted product from farmerProducts on deleteProduct.fulfilled", () => {
    const existingState = {
      ...baseState,
      farmerProducts: [
        { id: 1, name: "Tomates Bio" },
        { id: 2, name: "Olives Picholine" },
      ],
      products: [{ id: 1, name: "Tomates Bio" }],
    };

    const action = {
      type: deleteProduct.fulfilled.type,
      payload: 1,
    };

    const nextState = productReducer(existingState, action);
    expect(nextState.farmerProducts).toHaveLength(1);
    expect(nextState.farmerProducts[0].id).toBe(2);
    expect(nextState.products).toHaveLength(0);
    expect(selectProductsSuccess({ products: nextState })).toBe("Product deleted.");
  });

  it("should correctly handle clearProductSuccess and clearProductError", () => {
    const stateWithFeedback = {
      ...baseState,
      error: "Error occurred",
      successMessage: "Success!",
    };

    const withoutSuccess = productReducer(stateWithFeedback, clearProductSuccess());
    expect(withoutSuccess.successMessage).toBeNull();
    expect(withoutSuccess.error).toBe("Error occurred");

    const withoutError = productReducer(withoutSuccess, clearProductError());
    expect(withoutError.error).toBeNull();
  });
});
