import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "./profileApi";

function extractErrorMessage(error, defaultMsg = "Une erreur est survenue") {
    const data = error.response?.data;
    if (data?.errors) {
        return Object.values(data.errors).flat().join(" ");
    }
    return data?.message || error.message || defaultMsg;
}

export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await profileApi.getProfile();
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Impossible de charger le profil"));
        }
    }
);

export const saveFarmerProfile = createAsyncThunk(
    "profile/saveFarmerProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateFarmerProfile(profileData);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Échec de la mise à jour du profil agriculteur"));
        }
    }
);

export const saveBuyerProfile = createAsyncThunk(
    "profile/saveBuyerProfile",
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateBuyerProfile(profileData);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Échec de la mise à jour du profil acheteur"));
        }
    }
);

export const saveAccountInfo = createAsyncThunk(
    "profile/saveAccountInfo",
    async (accountData, { rejectWithValue }) => {
        try {
            const response = await profileApi.updateAccount(accountData);
            return response.data?.data ?? response.data;
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Échec de la mise à jour des coordonnées"));
        }
    }
);

export const changePassword = createAsyncThunk(
    "profile/changePassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await profileApi.updatePassword(passwordData);
            return response.data?.message || "Mot de passe modifié avec succès";
        } catch (error) {
            return rejectWithValue(extractErrorMessage(error, "Échec de la modification du mot de passe"));
        }
    }
);

const initialState = {
    profile: {
        account: null,
        roles: [],
        farmer_profile: null,
        professional_buyer_profile: null,
    },
    loading: false,
    saving: false,
    error: null,
    successMessage: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        clearProfileSuccess: (state) => {
            state.successMessage = null;
        },
        setProfileData: (state, action) => {
            state.profile = { ...state.profile, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        // fetchProfile
        builder.addCase(fetchProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload || initialState.profile;
        });
        builder.addCase(fetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // saveFarmerProfile
        builder.addCase(saveFarmerProfile.pending, (state) => {
            state.saving = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(saveFarmerProfile.fulfilled, (state, action) => {
            state.saving = false;
            state.profile.farmer_profile = action.payload;
            state.successMessage = "Profil agricole mis à jour avec succès.";
        });
        builder.addCase(saveFarmerProfile.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });

        // saveBuyerProfile
        builder.addCase(saveBuyerProfile.pending, (state) => {
            state.saving = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(saveBuyerProfile.fulfilled, (state, action) => {
            state.saving = false;
            state.profile.professional_buyer_profile = action.payload;
            state.successMessage = "Profil professionnel mis à jour avec succès.";
        });
        builder.addCase(saveBuyerProfile.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });

        // saveAccountInfo
        builder.addCase(saveAccountInfo.pending, (state) => {
            state.saving = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(saveAccountInfo.fulfilled, (state, action) => {
            state.saving = false;
            state.profile.account = { ...state.profile.account, ...action.payload };
            state.successMessage = "Informations personnelles mises à jour avec succès.";
        });
        builder.addCase(saveAccountInfo.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });

        // changePassword
        builder.addCase(changePassword.pending, (state) => {
            state.saving = true;
            state.error = null;
            state.successMessage = null;
        });
        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.saving = false;
            state.successMessage = action.payload || "Mot de passe modifié avec succès.";
        });
        builder.addCase(changePassword.rejected, (state, action) => {
            state.saving = false;
            state.error = action.payload;
        });
    },
});

export const { clearProfileError, clearProfileSuccess, setProfileData } = profileSlice.actions;
export default profileSlice.reducer;
