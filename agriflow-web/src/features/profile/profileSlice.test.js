import { describe, it, expect } from "vitest";
import profileReducer, {
    fetchProfile,
    saveFarmerProfile,
    saveBuyerProfile,
    saveAccountInfo,
    changePassword,
    clearProfileError,
    clearProfileSuccess,
    setProfileData,
} from "./profileSlice";
import {
    selectFarmerProfileCompletion,
    selectBuyerProfileCompletion,
} from "./profileSelectors";

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

describe("profileSlice — Reducers & Actions", () => {
    it("should return the initial state", () => {
        const state = profileReducer(undefined, { type: "@@INIT" });
        expect(state.loading).toBe(false);
        expect(state.saving).toBe(false);
        expect(state.profile.account).toBeNull();
        expect(state.profile.farmer_profile).toBeNull();
        expect(state.profile.professional_buyer_profile).toBeNull();
    });

    it("clearProfileError & clearProfileSuccess", () => {
        const stateWithMsg = { ...initialState, error: "Erreur", successMessage: "Succès" };
        const clearedErr = profileReducer(stateWithMsg, clearProfileError());
        expect(clearedErr.error).toBeNull();
        expect(clearedErr.successMessage).toBe("Succès");

        const clearedSucc = profileReducer(stateWithMsg, clearProfileSuccess());
        expect(clearedSucc.successMessage).toBeNull();
    });

    it("setProfileData updates profile data", () => {
        const update = { account: { id: 1, name: "Ali", email: "ali@agriflow.ma" } };
        const state = profileReducer(initialState, setProfileData(update));
        expect(state.profile.account.name).toBe("Ali");
    });
});

describe("profileSlice — ExtraReducers Async Thunks", () => {
    it("fetchProfile.pending / fulfilled / rejected", () => {
        const pendingState = profileReducer(initialState, { type: fetchProfile.pending.type });
        expect(pendingState.loading).toBe(true);
        expect(pendingState.error).toBeNull();

        const mockData = {
            account: { id: 10, name: "Omar", email: "omar@agriflow.ma", phone: "0612345678" },
            roles: ["farmer"],
            farmer_profile: {
                id: 1,
                farm_name: "Domaine Souss",
                description: "Producteur agrumes",
                address: "Route Taroudant",
                city: "Taroudant",
                region: "Souss-Massa",
            },
        };

        const fulfilledState = profileReducer(initialState, {
            type: fetchProfile.fulfilled.type,
            payload: mockData,
        });
        expect(fulfilledState.loading).toBe(false);
        expect(fulfilledState.profile.farmer_profile.farm_name).toBe("Domaine Souss");

        const rejectedState = profileReducer(initialState, {
            type: fetchProfile.rejected.type,
            payload: "Erreur réseau",
        });
        expect(rejectedState.loading).toBe(false);
        expect(rejectedState.error).toBe("Erreur réseau");
    });

    it("saveFarmerProfile.fulfilled updates farmer profile", () => {
        const updatedFarmer = {
            id: 1,
            farm_name: "Ferme Bio Atlas",
            address: "Vallée d'Ourika",
            city: "Marrakech",
            region: "Marrakech-Safi",
        };
        const state = profileReducer(initialState, {
            type: saveFarmerProfile.fulfilled.type,
            payload: updatedFarmer,
        });
        expect(state.saving).toBe(false);
        expect(state.profile.farmer_profile.farm_name).toBe("Ferme Bio Atlas");
        expect(state.successMessage).toContain("Profil agricole mis à jour");
    });

    it("saveBuyerProfile.fulfilled updates buyer profile", () => {
        const updatedBuyer = {
            id: 2,
            business_name: "Primeur Casablanca SARL",
            business_type: "Primeur & Fruits / Légumes",
            ice: "001234567890001",
            address: "Boulevard d'Anfa",
            city: "Casablanca",
            region: "Casablanca-Settat",
        };
        const state = profileReducer(initialState, {
            type: saveBuyerProfile.fulfilled.type,
            payload: updatedBuyer,
        });
        expect(state.saving).toBe(false);
        expect(state.profile.professional_buyer_profile.business_name).toBe("Primeur Casablanca SARL");
        expect(state.profile.professional_buyer_profile.ice).toBe("001234567890001");
    });

    it("saveAccountInfo.fulfilled updates account", () => {
        const updatedAccount = {
            id: 10,
            name: "Hassan Alami",
            phone: "0699887766",
        };
        const state = profileReducer(initialState, {
            type: saveAccountInfo.fulfilled.type,
            payload: updatedAccount,
        });
        expect(state.saving).toBe(false);
        expect(state.profile.account.name).toBe("Hassan Alami");
        expect(state.profile.account.phone).toBe("0699887766");
    });

    it("changePassword.fulfilled sets successMessage", () => {
        const state = profileReducer(initialState, {
            type: changePassword.fulfilled.type,
            payload: "Mot de passe modifié avec succès",
        });
        expect(state.saving).toBe(false);
        expect(state.successMessage).toBe("Mot de passe modifié avec succès");
    });
});

describe("profileSelectors — Completion calculations", () => {
    it("selectFarmerProfileCompletion calculates correctly for empty profile", () => {
        const rootState = {
            profile: { profile: { farmer_profile: null, account: null } },
            auth: { user: null },
        };
        const res = selectFarmerProfileCompletion(rootState);
        expect(res.percentage).toBe(0);
        expect(res.isComplete).toBe(false);
        expect(res.missingFields.length).toBeGreaterThan(0);
    });

    it("selectFarmerProfileCompletion calculates 100% for full farmer profile", () => {
        const rootState = {
            profile: {
                profile: {
                    farmer_profile: {
                        farm_name: "Atlas Fruits",
                        address: "Route 10",
                        city: "Agadir",
                        region: "Souss-Massa",
                        description: "Cultures sous serre",
                    },
                    account: {
                        phone: "0612345678",
                    },
                },
            },
        };
        const res = selectFarmerProfileCompletion(rootState);
        expect(res.percentage).toBe(100);
        expect(res.isComplete).toBe(true);
        expect(res.missingFields).toEqual([]);
    });

    it("selectBuyerProfileCompletion calculates correctly for buyer", () => {
        const rootState = {
            profile: {
                profile: {
                    professional_buyer_profile: {
                        business_name: "Épicerie Bio",
                        business_type: "Épicerie fine",
                        address: "Rue Ibn Battouta",
                        city: "Rabat",
                        region: "Rabat-Salé-Kénitra",
                        ice: "001122334455667",
                    },
                    account: {
                        phone: "0600000000",
                    },
                },
            },
        };
        const res = selectBuyerProfileCompletion(rootState);
        expect(res.percentage).toBe(100);
        expect(res.isComplete).toBe(true);
    });
});
