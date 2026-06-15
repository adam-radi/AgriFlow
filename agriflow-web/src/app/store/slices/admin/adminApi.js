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
        axiosClient.post(ADMIN_ENDPOINTS.suspendUser(id)),

    disableProduct: (id) =>
        axiosClient.post(ADMIN_ENDPOINTS.disableProduct(id)),
};
