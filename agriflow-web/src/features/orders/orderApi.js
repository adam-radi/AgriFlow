import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const orderAPI = {
    getOrders: () =>
        axiosClient.get(ENDPOINTS.ORDERS),

    getOrder: (id) =>
        axiosClient.get(`${ENDPOINTS.ORDERS}/${id}`),

    createOrder: (payload) =>
        axiosClient.post(ENDPOINTS.ORDERS, payload),

    getFarmerOrders: () =>
        axiosClient.get(ENDPOINTS.FARMER_ORDERS),

    getAdminOrders: () =>
        axiosClient.get(ENDPOINTS.ADMIN_ORDERS),
};
