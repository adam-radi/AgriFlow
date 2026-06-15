export const selectCartItems = (state) => state.orders.cartItems;

export const selectCartCount = (state) =>
    state.orders.cartItems.reduce((sum, item) => sum + item.packQuantity, 0);

export const selectCartTotal = (state) =>
    state.orders.cartItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);

export const selectCartTotalWeight = (state) =>
    state.orders.cartItems.reduce((sum, item) => sum + (item.totalWeight || 0), 0);

export const selectOrders = (state) => state.orders.orders;

export const selectCurrentOrder = (state) => state.orders.currentOrder;

export const selectOrdersLoading = (state) => state.orders.loading;

export const selectOrdersError = (state) => state.orders.error;

export const selectOrdersSuccess = (state) => state.orders.success;
