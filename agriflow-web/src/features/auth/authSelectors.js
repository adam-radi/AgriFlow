
export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectToken = (state) => state.auth.token;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

// Backward-compat typo (used by ProtectedRoute.jsx)

export const selectAuthError = (state) => state.auth.error;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectUserRole = (state) => state.auth.user?.role;

