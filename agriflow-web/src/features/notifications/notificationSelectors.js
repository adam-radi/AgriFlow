export const selectNotifications = (state) => state.notifications?.notifications || [];
export const selectUnreadCount = (state) => state.notifications?.unreadCount || 0;
export const selectNotificationLoading = (state) => state.notifications?.loading || false;
export const selectNotificationError = (state) => state.notifications?.error || null;
