import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerClient, registerFarmer, logoutUser } from "./authThunks";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    user,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    successMessage: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            state.successMessage = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            const { user, token } = action.payload || {};
            if (user) {
                state.user = user;
                localStorage.setItem("user", JSON.stringify(user));
            }
            if (token) {
                state.token = token;
                localStorage.setItem("token", token);
            }
            state.isAuthenticated = true;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Register Client
        builder.addCase(registerClient.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(registerClient.fulfilled, (state, action) => {
            state.loading = false;
            // Auto-login after registration
            const { user, token } = action.payload || {};
            if (user) {
                state.user = user;
                localStorage.setItem("user", JSON.stringify(user));
            }
            if (token) {
                state.token = token;
                localStorage.setItem("token", token);
                state.isAuthenticated = true;
            }
            state.successMessage = "Account created successfully!";
        });
        builder.addCase(registerClient.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'object'
                ? Object.values(action.payload).flat().join(' ')
                : action.payload;
        });

        // Register Farmer
        builder.addCase(registerFarmer.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(registerFarmer.fulfilled, (state, action) => {
            state.loading = false;
            const { user, token } = action.payload || {};
            if (user) {
                state.user = user;
                localStorage.setItem("user", JSON.stringify(user));
            }
            if (token) {
                state.token = token;
                localStorage.setItem("token", token);
                state.isAuthenticated = true;
            }
            state.successMessage = "Farmer account created! Awaiting approval.";
        });
        builder.addCase(registerFarmer.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'object'
                ? Object.values(action.payload).flat().join(' ')
                : action.payload;
        });

        // Logout
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        });
        builder.addCase(logoutUser.rejected, (state) => {
            // Still clear local state even if API fails
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        });
    },
});

export const { setCredentials, logout, updateUser, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
