import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const notificationAPI = {
    getNotifications: () =>
        axiosClient.get(ENDPOINTS.NOTIFICATIONS.BASE),

    markAsRead: (id) =>
        axiosClient.post(ENDPOINTS.NOTIFICATIONS.READ(id)),

    markAllAsRead: () =>
        axiosClient.post(ENDPOINTS.NOTIFICATIONS.READ_ALL),
};
