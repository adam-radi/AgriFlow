import axios from 'axios';
import store from '../app/store'
import { logout } from '../features/auth/authSlice';
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-type": "application/json",
        accept: "application/json",
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth?.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {

            store.dispatch(logout());

            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
export default axiosClient;