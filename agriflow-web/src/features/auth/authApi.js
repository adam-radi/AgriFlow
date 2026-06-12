import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const loginRequest = (data) => 
    axiosClient.post(ENDPOINTS.AUTH.LOGIN, data);