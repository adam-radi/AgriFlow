// productSelectors.js — Clean selectors to avoid deep state coupling in components.
// Usage: const products = useSelector(selectAllProducts);

/** Full list of public/catalog products */
export const selectAllProducts = (state) => state.products.products;

/** Currently viewed product detail */
export const selectSelectedProduct = (state) => state.products.selectedProduct;

/** Authenticated farmer's own products */
export const selectFarmerProducts = (state) => state.products.farmerProducts;

/** Loading state (any product operation) */
export const selectProductsLoading = (state) => state.products.loading;

/** Last error message */
export const selectProductsError = (state) => state.products.error;

/** Last success message */
export const selectProductsSuccess = (state) => state.products.successMessage;

/** Pagination metadata */
export const selectProductsPagination = (state) => state.products.pagination;

/** Current search query string */
export const selectSearchQuery = (state) => state.products.searchQuery;
