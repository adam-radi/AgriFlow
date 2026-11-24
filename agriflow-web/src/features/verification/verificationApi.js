import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const verificationApi = {
    getActive: () => axiosClient.get(ENDPOINTS.VERIFICATION.ACTIVE),
    getHistory: () => axiosClient.get(ENDPOINTS.VERIFICATION.HISTORY),
    submitFarmer: (formData) =>
        axiosClient.post(ENDPOINTS.VERIFICATION.SUBMIT_FARMER, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    submitBuyer: (formData) =>
        axiosClient.post(ENDPOINTS.VERIFICATION.SUBMIT_BUYER, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};
