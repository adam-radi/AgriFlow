export const selectVerificationState = (state) => state.verification;
export const selectActiveVerification = (state) => state.verification?.activeRequest;
export const selectVerificationHistory = (state) => state.verification?.history ?? [];
export const selectVerificationLoading = (state) => state.verification?.loading ?? false;
export const selectVerificationSubmitting = (state) => state.verification?.submitting ?? false;
export const selectVerificationError = (state) => state.verification?.error;
export const selectVerificationSuccess = (state) => state.verification?.successMessage;

/**
 * Statuts réels du backend :
 * not_submitted | pending | under_review | approved | rejected | additional_information_required
 */
export const selectVerificationStatus = (state) => {
    // Si une demande active existe
    const active = state.verification?.activeRequest;
    if (active?.status) {
        return active.status;
    }

    // Fallback avec farmer_status si l'utilisateur est un agriculteur
    const user = state.auth?.user;
    if (user?.farmer_status) {
        return user.farmer_status;
    }

    return "not_submitted";
};

export const selectVerificationDocuments = (state) => {
    return state.verification?.activeRequest?.documents || [];
};

export const selectVerificationReviews = (state) => {
    return state.verification?.activeRequest?.reviews || [];
};

/**
 * Helpers Phase 07 : Contrôle des accès selon la vérification
 */
export const selectIsVerified = (state) => selectVerificationStatus(state) === "approved";
export const selectIsPending = (state) => ["pending", "under_review"].includes(selectVerificationStatus(state));
export const selectIsRejected = (state) => ["rejected", "additional_information_required"].includes(selectVerificationStatus(state));
export const selectIsNotSubmitted = (state) => selectVerificationStatus(state) === "not_submitted";
export const selectCanPublish = (state) => selectIsVerified(state);
