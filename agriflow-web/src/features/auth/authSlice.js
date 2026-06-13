import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerClient, registerFarmer } from "./authThunks";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

const initialState = {
    user,
    token: token || null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
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
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem("user", JSON.stringify(state.user));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            const { user, token } = action.payload || {};
            if (user) state.user = user;
            if (token) state.token = token;
            state.isAuthenticated = true;
            if (token) localStorage.setItem("token", token);
            if (user) localStorage.setItem("user", JSON.stringify(user));
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(registerClient.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerClient.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(registerClient.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        builder.addCase(registerFarmer.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerFarmer.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(registerFarmer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

