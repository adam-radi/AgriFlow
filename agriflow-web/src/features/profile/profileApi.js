import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const profileApi = {
    getProfile: () => axiosClient.get(ENDPOINTS.PROFILE.GET),
    updateFarmerProfile: (data) => axiosClient.put(ENDPOINTS.PROFILE.UPDATE_FARMER, data),
    updateBuyerProfile: (data) => axiosClient.put(ENDPOINTS.PROFILE.UPDATE_BUYER, data),
    getAccount: () => axiosClient.get(ENDPOINTS.ACCOUNT.GET),
    updateAccount: (data) => axiosClient.put(ENDPOINTS.ACCOUNT.UPDATE, data),
    updatePassword: (data) => axiosClient.patch(ENDPOINTS.ACCOUNT.UPDATE_PASSWORD, data),
};
