import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import endpoints from "../../api/endPoints";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(endpoints.AUTH.LOGIN, credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "login failed"
            );
        }
    }
);

export const registerClient = createAsyncThunk(
    "auth/registerClient",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(endpoints.AUTH.registerClient, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Client registration failed"
            );
        }
    }
);

export const registerFarmer = createAsyncThunk(
    "auth/registerFarmer",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post(endpoints.AUTH.registerFarmer, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "farmer registration failed"
            );
        }
    }
);

