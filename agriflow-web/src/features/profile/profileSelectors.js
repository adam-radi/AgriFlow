export const selectProfileState = (state) => state.profile;
export const selectProfile = (state) => state.profile?.profile;
export const selectAccount = (state) => state.profile?.profile?.account;
export const selectFarmerProfile = (state) => state.profile?.profile?.farmer_profile;
export const selectBuyerProfile = (state) => state.profile?.profile?.professional_buyer_profile;
export const selectProfileLoading = (state) => state.profile?.loading ?? false;
export const selectProfileSaving = (state) => state.profile?.saving ?? false;
export const selectProfileError = (state) => state.profile?.error;
export const selectProfileSuccess = (state) => state.profile?.successMessage;

/**
 * Calcul dynamique du taux de complétion du profil agriculteur
 */
export const selectFarmerProfileCompletion = (state) => {
    const farmer = state.profile?.profile?.farmer_profile || {};
    const account = state.profile?.profile?.account || state.auth?.user || {};

    const fields = [
        { key: "farm_name", label: "Nom de l'exploitation", value: farmer.farm_name, weight: 25 },
        { key: "address", label: "Adresse de l'exploitation", value: farmer.address, weight: 20 },
        { key: "city", label: "Ville", value: farmer.city, weight: 15 },
        { key: "region", label: "Région", value: farmer.region, weight: 15 },
        { key: "phone", label: "Numéro de téléphone", value: account.phone, weight: 15 },
        { key: "description", label: "Présentation / Description", value: farmer.description, weight: 10 },
    ];

    let completedWeight = 0;
    const missingFields = [];

    fields.forEach((field) => {
        if (field.value && String(field.value).trim().length > 0) {
            completedWeight += field.weight;
        } else {
            missingFields.push(field.label);
        }
    });

    return {
        percentage: Math.min(100, completedWeight),
        missingFields,
        isComplete: missingFields.length === 0,
    };
};

/**
 * Calcul dynamique du taux de complétion du profil acheteur professionnel
 */
export const selectBuyerProfileCompletion = (state) => {
    const buyer = state.profile?.profile?.professional_buyer_profile || {};
    const account = state.profile?.profile?.account || state.auth?.user || {};

    const fields = [
        { key: "business_name", label: "Nom de l'établissement / Raison sociale", value: buyer.business_name, weight: 25 },
        { key: "business_type", label: "Type d'activité commerciale", value: buyer.business_type, weight: 20 },
        { key: "address", label: "Adresse professionnelle", value: buyer.address, weight: 15 },
        { key: "city", label: "Ville", value: buyer.city, weight: 15 },
        { key: "region", label: "Région", value: buyer.region, weight: 10 },
        { key: "ice", label: "Numéro ICE (15 chiffres)", value: buyer.ice, weight: 10 },
        { key: "phone", label: "Téléphone du responsable", value: account.phone, weight: 5 },
    ];

    let completedWeight = 0;
    const missingFields = [];

    fields.forEach((field) => {
        if (field.value && String(field.value).trim().length > 0) {
            completedWeight += field.weight;
        } else {
            missingFields.push(field.label);
        }
    });

    return {
        percentage: Math.min(100, completedWeight),
        missingFields,
        isComplete: missingFields.length === 0,
    };
};
