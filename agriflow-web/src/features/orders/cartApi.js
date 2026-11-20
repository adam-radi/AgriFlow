import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const cartAPI = {
    getCart: () =>
        axiosClient.get(ENDPOINTS.CART),

    addItem: (payload) =>
        axiosClient.post(ENDPOINTS.CART, payload),

    updateItem: (itemId, quantity) =>
        axiosClient.put(ENDPOINTS.CART_ITEM(itemId), { quantity }),

    removeItem: (itemId) =>
        axiosClient.delete(ENDPOINTS.CART_ITEM(itemId)),

    clearCart: () =>
        axiosClient.delete(ENDPOINTS.CART),
};
