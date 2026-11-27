import { describe, it, expect } from "vitest";
import notificationReducer, {
    clearNotificationError,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "./notificationSlice";
import {
    selectNotifications,
    selectUnreadCount,
    selectNotificationLoading,
    selectNotificationError,
} from "./notificationSelectors";

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

describe("notificationSlice reducers & thunks", () => {
    it("returns correct initial state", () => {
        const state = notificationReducer(undefined, { type: "@@INIT" });
        expect(state.notifications).toEqual([]);
        expect(state.unreadCount).toBe(0);
        expect(state.loading).toBe(false);
    });

    it("clearNotificationError resets error", () => {
        const state = notificationReducer({ ...initialState, error: "Network error" }, clearNotificationError());
        expect(state.error).toBeNull();
    });

    it("fetchNotifications.fulfilled populates notifications and unread count", () => {
        const payload = {
            unread_count: 2,
            data: [
                { id: "1", is_read: false, title: "Nouvelle demande" },
                { id: "2", is_read: false, title: "Demande acceptée" },
            ],
        };
        const state = notificationReducer(initialState, {
            type: fetchNotifications.fulfilled.type,
            payload,
        });
        expect(state.loading).toBe(false);
        expect(state.unreadCount).toBe(2);
        expect(state.notifications).toHaveLength(2);
    });

    it("markNotificationAsRead.fulfilled marks target as read and updates unreadCount", () => {
        const startingState = {
            ...initialState,
            unreadCount: 2,
            notifications: [
                { id: "n1", is_read: false, title: "Notification 1" },
                { id: "n2", is_read: false, title: "Notification 2" },
            ],
        };
        const action = {
            type: markNotificationAsRead.fulfilled.type,
            payload: {
                id: "n1",
                data: { unread_count: 1, data: { read_at: "2026-11-27T22:00:00Z" } },
            },
        };
        const state = notificationReducer(startingState, action);
        expect(state.notifications[0].is_read).toBe(true);
        expect(state.notifications[1].is_read).toBe(false);
        expect(state.unreadCount).toBe(1);
    });

    it("markAllNotificationsAsRead.fulfilled marks all as read and sets unreadCount to 0", () => {
        const startingState = {
            ...initialState,
            unreadCount: 3,
            notifications: [
                { id: "1", is_read: false },
                { id: "2", is_read: false },
                { id: "3", is_read: true },
            ],
        };
        const state = notificationReducer(startingState, {
            type: markAllNotificationsAsRead.fulfilled.type,
            payload: { unread_count: 0 },
        });
        expect(state.unreadCount).toBe(0);
        expect(state.notifications.every((n) => n.is_read)).toBe(true);
    });
});

describe("notificationSelectors", () => {
    const rootState = {
        notifications: {
            notifications: [{ id: "n1", title: "Test" }],
            unreadCount: 5,
            loading: false,
            error: null,
        },
    };

    it("extracts state accurately", () => {
        expect(selectNotifications(rootState)).toHaveLength(1);
        expect(selectUnreadCount(rootState)).toBe(5);
        expect(selectNotificationLoading(rootState)).toBe(false);
        expect(selectNotificationError(rootState)).toBeNull();
    });
});
