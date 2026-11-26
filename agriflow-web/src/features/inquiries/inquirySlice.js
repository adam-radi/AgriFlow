import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { inquiryAPI } from "./inquiryApi";

function unwrapData(res) {
    return res.data?.data ?? res.data;
}

export const fetchInquiries = createAsyncThunk(
    "inquiries/fetchAll",
    async (params, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.getInquiries(params);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data || "Impossible de charger les demandes");
        }
    }
);

export const fetchInquiryById = createAsyncThunk(
    "inquiries/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.getInquiry(id);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data || "Demande d'achat introuvable");
        }
    }
);

export const createInquiry = createAsyncThunk(
    "inquiries/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.createInquiry(payload);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.errors || "Erreur lors de la création de la demande");
        }
    }
);

export const submitCounterOffer = createAsyncThunk(
    "inquiries/counterOffer",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.counterOffer(id, data);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.errors || "Impossible d'envoyer la contre-proposition");
        }
    }
);

export const acceptInquiryOffer = createAsyncThunk(
    "inquiries/accept",
    async (id, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.acceptOffer(id);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible d'accepter l'offre");
        }
    }
);

export const confirmInquiryAgreement = createAsyncThunk(
    "inquiries/confirm",
    async (id, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.confirmAgreement(id);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible de confirmer l'accord");
        }
    }
);

export const rejectInquiry = createAsyncThunk(
    "inquiries/reject",
    async ({ id, reason }, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.rejectInquiry(id, reason);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible de refuser la demande");
        }
    }
);

export const cancelInquiry = createAsyncThunk(
    "inquiries/cancel",
    async (id, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.cancelInquiry(id);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible d'annuler la demande");
        }
    }
);

export const updateInquiryDeliveryStatus = createAsyncThunk(
    "inquiries/updateDeliveryStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await inquiryAPI.updateDeliveryStatus(id, status);
            return unwrapData(res);
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Impossible de mettre à jour le statut de livraison");
        }
    }
);

const initialState = {
    inquiries: [],
    currentInquiry: null,
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
};

const inquirySlice = createSlice({
    name: "inquiries",
    initialState,
    reducers: {
        clearInquiryError: (state) => {
            state.error = null;
        },
        clearInquirySuccess: (state) => {
            state.successMessage = null;
        },
        clearCurrentInquiry: (state) => {
            state.currentInquiry = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchInquiries
            .addCase(fetchInquiries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInquiries.fulfilled, (state, action) => {
                state.loading = false;
                state.inquiries = Array.isArray(action.payload) ? action.payload : (action.payload?.data || []);
            })
            .addCase(fetchInquiries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchInquiryById
            .addCase(fetchInquiryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInquiryById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInquiry = action.payload;
            })
            .addCase(fetchInquiryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // createInquiry
            .addCase(createInquiry.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createInquiry.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.inquiries.unshift(action.payload);
                state.currentInquiry = action.payload;
                state.successMessage = "Demande d'achat transmise avec succès à l'agriculteur.";
            })
            .addCase(createInquiry.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // submitCounterOffer
            .addCase(submitCounterOffer.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(submitCounterOffer.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Contre-proposition enregistrée avec succès.";
            })
            .addCase(submitCounterOffer.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // acceptInquiryOffer
            .addCase(acceptInquiryOffer.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(acceptInquiryOffer.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Offre acceptée avec succès.";
            })
            .addCase(acceptInquiryOffer.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // confirmInquiryAgreement
            .addCase(confirmInquiryAgreement.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(confirmInquiryAgreement.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Accord transactionnel confirmé définitivement !";
            })
            .addCase(confirmInquiryAgreement.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // rejectInquiry
            .addCase(rejectInquiry.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(rejectInquiry.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Demande refusée.";
            })
            .addCase(rejectInquiry.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // cancelInquiry
            .addCase(cancelInquiry.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(cancelInquiry.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Demande annulée avec succès.";
            })
            .addCase(cancelInquiry.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // updateInquiryDeliveryStatus
            .addCase(updateInquiryDeliveryStatus.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(updateInquiryDeliveryStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.currentInquiry = action.payload;
                const idx = state.inquiries.findIndex((i) => i.id === action.payload.id);
                if (idx !== -1) {
                    state.inquiries[idx] = action.payload;
                }
                state.successMessage = "Statut logistique actualisé.";
            })
            .addCase(updateInquiryDeliveryStatus.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearInquiryError, clearInquirySuccess, clearCurrentInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;
