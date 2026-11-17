import axiosClient from "../../../../api/axiosClient";
import ADMIN_ENDPOINTS from "../../../../api/admin/adminEndpoints";

export const adminAPI = {
    getUsers: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.users, { params }),

    getFarmers: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.farmers, { params }),

    getProducts: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.products, { params }),

    getOrders: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.orders, { params }),

    getHarvests: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.harvests, { params }),

    getStats: (params = {}) =>
        axiosClient.get(ADMIN_ENDPOINTS.stats, { params }),

    validateFarmer: (id) =>
        axiosClient.post(ADMIN_ENDPOINTS.validateFarmer(id)),

    rejectFarmer: (id) =>
        axiosClient.post(ADMIN_ENDPOINTS.rejectFarmer(id)),

    suspendUser: (id) =>
        axiosClient.delete(ADMIN_ENDPOINTS.suspendUser(id)),

    disableProduct: (id) =>
        axiosClient.post(ADMIN_ENDPOINTS.disableProduct(id)),

    enableProduct: (id) =>
        axiosClient.post(ADMIN_ENDPOINTS.enableProduct(id)),

    updateProduct: (id, formData) =>
        axiosClient.post(ADMIN_ENDPOINTS.updateProduct(id), formData, {
            headers: { "Content-Type": "multipart/form-data" },
            params: { _method: "PUT" },
        }),

    deleteProduct: (id) =>
        axiosClient.delete(ADMIN_ENDPOINTS.deleteProduct(id)),

    updateOrderStatus: (id, status) =>
        axiosClient.post(ADMIN_ENDPOINTS.updateOrderStatus(id, status)),

    createDeliveryUser: (data) =>
        axiosClient.post(ADMIN_ENDPOINTS.createDeliveryUser, data),
};
