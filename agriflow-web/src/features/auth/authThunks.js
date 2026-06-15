import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
            // Backend returns: { success, message, data: { user, token } }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);

export const registerClient = createAsyncThunk(
    "auth/registerClient",
    async (data, { rejectWithValue }) => {
        try {
            // Single register endpoint, role=Client
            const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, {
                ...data,
                role: "Client",
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.errors ||
                "Client registration failed"
            );
        }
    }
);

export const registerFarmer = createAsyncThunk(
    "auth/registerFarmer",
    async (data, { rejectWithValue }) => {
        try {
            // Single register endpoint, role=Farmer
            const response = await axiosClient.post(ENDPOINTS.AUTH.REGISTER, {
                ...data,
                role: "Farmer",
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.errors ||
                "Farmer registration failed"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axiosClient.get(ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            // Even if request fails, clear local state
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);
