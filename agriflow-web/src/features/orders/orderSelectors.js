export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) => state.cart.count;

export const selectCartTotal = (state) => state.cart.total;

export const selectCartLoading = (state) => state.cart.loading;

export const selectCartError = (state) => state.cart.error;

export const selectOrders = (state) => state.orders.orders;

export const selectCurrentOrder = (state) => state.orders.currentOrder;

export const selectOrdersLoading = (state) => state.orders.loading;

export const selectOrdersError = (state) => state.orders.error;

export const selectOrdersSuccess = (state) => state.orders.success;
