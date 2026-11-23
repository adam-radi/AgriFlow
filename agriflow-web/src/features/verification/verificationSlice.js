import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { verificationApi } from "./verificationApi";

function extractErrorMessage(error, defaultMsg = "Une erreur est survenue") {
    const data = error.response?.data;
    if (data?.errors) {
        return Object.values(data.errors).flat().join(" ");
    }
    return data?.message || error.message || defaultMsg;
}

export const fetchActiveVerification = createAsyncThunk(
    "verification/fetchActive",
    async (_, { rejectWithValue }) => {
        try {
            const response = await verificationApi.getActive();
            return response.data?.data ?? null;
        } catch (error) {
            // Si la route retourne 404 (non encore exposée sur l'API), on retourne null sans bloquer
            if (error.response?.status === 404) {
                return null;
            }
            return rejectWithValue(extractErrorMessage(error, "Impossible de charger la demande de vérification"));
        }
    }
);

export const fetchVerificationHistory = createAsyncThunk(
    "verification/fetchHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await verificationApi.getHistory();
            const data = response.data?.data ?? response.data;
            return Array.isArray(data) ? data : data?.data ?? [];
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            return rejectWithValue(extractErrorMessage(error, "Impossible de charger l'historique"));
        }
    }
);

export const submitVerification = createAsyncThunk(
    "verification/submit",
    async ({ accountType, formData }, { rejectWithValue }) => {
        try {
            const apiCall = accountType === "farmer"
                ? verificationApi.submitFarmer
                : verificationApi.submitBuyer;

            const response = await apiCall(formData);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Échec de l'envoi de la demande"));
        }
    }
);

const initialState = {
    activeRequest: null,
    history: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
};

const verificationSlice = createSlice({
    name: "verification",
    initialState,
    reducers: {
        clearVerificationError: (state) => {
            state.error = null;
        },
        clearVerificationSuccess: (state) => {
            state.successMessage = null;
        },
        setActiveRequestFallback: (state, action) => {
            state.activeRequest = action.payload;
        },
    },
    extraReducers: (builder) => {
        // fetchActiveVerification
        builder.addCase(fetchActiveVerification.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchActiveVerification.fulfilled, (state, action) => {
            state.loading = false;
            state.activeRequest = action.payload;
        });
        builder.addCase(fetchActiveVerification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // fetchVerificationHistory
        builder.addCase(fetchVerificationHistory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchVerificationHistory.fulfilled, (state, action) => {
            state.loading = false;
            state.history = action.payload || [];
        });
        builder.addCase(fetchVerificationHistory.rejected, (state) => {
            state.loading = false;
        });

        // submitVerification
        builder.addCase(submitVerification.pending, (state) => {
            state.submitting = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(submitVerification.fulfilled, (state, action) => {
            state.submitting = false;
            state.activeRequest = action.payload;
            state.successMessage = "Votre dossier de vérification a été transmis avec succès.";
        });
        builder.addCase(submitVerification.rejected, (state, action) => {
            state.submitting = false;
            state.error = action.payload;
        });
    },
});

export const { clearVerificationError, clearVerificationSuccess, setActiveRequestFallback } = verificationSlice.actions;
export default verificationSlice.reducer;
