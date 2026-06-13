import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const authAPI={
    login: (data) => {
        return axiosClient.post(ENDPOINTS.AUTH.LOGIN , data);
    },
    registerClient: (data) => {
        return axiosClient.post(ENDPOINTS.AUTH.REGISTER , data);
    },
    logout: () => {
        return axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
    },
    me: () => {
        return axiosClient.get(ENDPOINTS.AUTH.PROFILE);
    }
}
