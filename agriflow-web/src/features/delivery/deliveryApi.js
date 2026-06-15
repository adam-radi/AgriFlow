import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const deliveryAPI = {
    getGroups: (params = {}) =>
        axiosClient.get(ENDPOINTS.DELIVERY.BASE, { params }),

    getGroupById: (id) =>
        axiosClient.get(ENDPOINTS.DELIVERY.GET_ONE(id)),

    createGroup: (data) =>
        axiosClient.post(ENDPOINTS.DELIVERY.CREATE, data),

    assignOrders: (id, payload) =>
        axiosClient.post(ENDPOINTS.DELIVERY.ASSIGN_ORDERS(id), payload),

    updateStatus: (id, status) =>
        axiosClient.patch(ENDPOINTS.DELIVERY.UPDATE_STATUS(id), { status }),

    getRoute: (id) =>
        axiosClient.get(ENDPOINTS.DELIVERY.ROUTE(id)),
};
