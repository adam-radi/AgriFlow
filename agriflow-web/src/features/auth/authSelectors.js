export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthError = (state) => state.auth.error;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectUserRole = (state) => state.auth.user?.role;

export const selectAuthSuccess = (state) => state.auth.successMessage;
