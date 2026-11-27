import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationAPI } from "./notificationApi";

export const fetchNotifications = createAsyncThunk(
    "notifications/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await notificationAPI.getNotifications();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible de charger les notifications");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    "notifications/markRead",
    async (id, { rejectWithValue }) => {
        try {
            const res = await notificationAPI.markAsRead(id);
            return { id, data: res.data };
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Erreur lors du marquage comme lu");
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    "notifications/markAllRead",
    async (_, { rejectWithValue }) => {
        try {
            const res = await notificationAPI.markAllAsRead();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Erreur lors du marquage global");
        }
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchNotifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload?.data || [];
                state.unreadCount = action.payload?.unread_count ?? 0;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // markNotificationAsRead
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const { id, data } = action.payload;
                const notif = state.notifications.find((n) => n.id === id);
                if (notif && !notif.is_read) {
                    notif.is_read = true;
                    notif.read_at = data?.data?.read_at || new Date().toISOString();
                }
                if (typeof data?.unread_count === "number") {
                    state.unreadCount = data.unread_count;
                } else if (state.unreadCount > 0) {
                    state.unreadCount -= 1;
                }
            })

            // markAllNotificationsAsRead
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach((n) => {
                    n.is_read = true;
                    n.read_at = n.read_at || new Date().toISOString();
                });
                state.unreadCount = 0;
            });
    },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
