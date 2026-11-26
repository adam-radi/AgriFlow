import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const inquiryAPI = {
    getInquiries: (params = {}) =>
        axiosClient.get(ENDPOINTS.INQUIRIES.BASE, { params }),

    getInquiry: (id) =>
        axiosClient.get(ENDPOINTS.INQUIRIES.DETAILS(id)),

    createInquiry: (payload) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.BASE, payload),

    counterOffer: (id, payload) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.COUNTER_OFFER(id), payload),

    acceptOffer: (id) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.ACCEPT(id)),

    confirmAgreement: (id) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.CONFIRM(id)),

    rejectInquiry: (id, reason) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.REJECT(id), { reason }),

    cancelInquiry: (id) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.CANCEL(id)),

    updateDeliveryStatus: (id, status) =>
        axiosClient.post(ENDPOINTS.INQUIRIES.DELIVERY_STATUS(id, status)),
};
