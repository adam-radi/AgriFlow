import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const harvestAPI = {
    getAll: (params = {}) =>
        axiosClient.get(ENDPOINTS.HARVESTS, { params }),

    getById: (id) =>
        axiosClient.get(ENDPOINTS.HARVEST_DETAILS(id)),

    create: (data) =>
        axiosClient.post(ENDPOINTS.HARVEST_CREATE, data),

    update: (id, data) =>
        axiosClient.put(ENDPOINTS.HARVEST_UPDATE(id), data),

    delete: (id) =>
        axiosClient.delete(ENDPOINTS.HARVEST_DELETE(id)),

    getFarmerHarvests: () =>
        axiosClient.get(ENDPOINTS.FARMER_HARVESTS),

    getForecast: (id) =>
        axiosClient.get(ENDPOINTS.HARVEST_FORECAST(id)),

    getOrders: (id) =>
        axiosClient.get(ENDPOINTS.HARVEST_ORDERS(id)),

    getAdminHarvests: (params = {}) =>
        axiosClient.get(ENDPOINTS.ADMIN_HARVESTS, { params }),
};
