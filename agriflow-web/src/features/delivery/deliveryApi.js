import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const deliveryAPI = {
    getGroups: (params = {}) =>
        axiosClient.get(ENDPOINTS.DELIVERY.BASE, { params }),

    getGroupById: (id) =>
        axiosClient.get(ENDPOINTS.DELIVERY.GET_ONE(id)),

    createGroup: (data) =>
        axiosClient.post(ENDPOINTS.DELIVERY.CREATE, data),

    assignLivreur: (groupId, userId) =>
        axiosClient.post(ENDPOINTS.DELIVERY.ASSIGN_LIVREUR(groupId, userId)),

    updateStatus: (id, status) =>
        axiosClient.post(`/deliveries/${id}/status/${status}`),

    getRoute: (id) =>
        axiosClient.get(ENDPOINTS.DELIVERY.ROUTE(id)),
};
