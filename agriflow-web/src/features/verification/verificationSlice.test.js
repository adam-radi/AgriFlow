import { describe, it, expect } from "vitest";
import verificationReducer, {
    fetchActiveVerification,
    fetchVerificationHistory,
    submitVerification,
    clearVerificationError,
    clearVerificationSuccess,
    setActiveRequestFallback,
} from "./verificationSlice";
import {
    selectVerificationStatus,
    selectVerificationDocuments,
    selectVerificationReviews,
} from "./verificationSelectors";

const initialState = {
    activeRequest: null,
    history: [],
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
};

describe("verificationSlice — Reducers & Actions", () => {
    it("should return the initial state", () => {
        const state = verificationReducer(undefined, { type: "@@INIT" });
        expect(state.activeRequest).toBeNull();
        expect(state.history).toEqual([]);
        expect(state.loading).toBe(false);
        expect(state.submitting).toBe(false);
    });

    it("clearVerificationError and clearVerificationSuccess", () => {
        const stateWithErr = { ...initialState, error: "Erreur test", successMessage: "Succès test" };
        const cleared = verificationReducer(stateWithErr, clearVerificationError());
        expect(cleared.error).toBeNull();
        expect(cleared.successMessage).toBe("Succès test");

        const clearedSucc = verificationReducer(stateWithErr, clearVerificationSuccess());
        expect(clearedSucc.successMessage).toBeNull();
    });

    it("setActiveRequestFallback sets active request", () => {
        const mockRequest = { id: 5, status: "pending", account_type: "farmer" };
        const state = verificationReducer(initialState, setActiveRequestFallback(mockRequest));
        expect(state.activeRequest).toEqual(mockRequest);
    });
});

describe("verificationSlice — ExtraReducers Async Thunks", () => {
    it("fetchActiveVerification.pending / fulfilled / rejected", () => {
        const pending = verificationReducer(initialState, { type: fetchActiveVerification.pending.type });
        expect(pending.loading).toBe(true);

        const mockActive = {
            id: 1,
            account_type: "farmer",
            status: "under_review",
            submitted_at: "2026-11-15T10:00:00Z",
            documents: [
                { id: 10, document_type: "identity", original_name: "cin_recto.pdf", file_size: 1024 },
            ],
            reviews: [],
        };

        const fulfilled = verificationReducer(initialState, {
            type: fetchActiveVerification.fulfilled.type,
            payload: mockActive,
        });
        expect(fulfilled.loading).toBe(false);
        expect(fulfilled.activeRequest.status).toBe("under_review");
        expect(fulfilled.activeRequest.documents.length).toBe(1);

        const rejected = verificationReducer(initialState, {
            type: fetchActiveVerification.rejected.type,
            payload: "Erreur serveur",
        });
        expect(rejected.loading).toBe(false);
        expect(rejected.error).toBe("Erreur serveur");
    });

    it("submitVerification.pending / fulfilled / rejected", () => {
        const pending = verificationReducer(initialState, { type: submitVerification.pending.type });
        expect(pending.submitting).toBe(true);
        expect(pending.error).toBeNull();

        const submitted = {
            id: 2,
            account_type: "farmer",
            status: "pending",
            submitted_at: "2026-11-19T20:00:00Z",
        };

        const fulfilled = verificationReducer(initialState, {
            type: submitVerification.fulfilled.type,
            payload: submitted,
        });
        expect(fulfilled.submitting).toBe(false);
        expect(fulfilled.activeRequest.status).toBe("pending");
        expect(fulfilled.successMessage).toContain("transmis avec succès");

        const rejected = verificationReducer(initialState, {
            type: submitVerification.rejected.type,
            payload: "Taille de fichier dépassée",
        });
        expect(rejected.submitting).toBe(false);
        expect(rejected.error).toBe("Taille de fichier dépassée");
    });

    it("fetchVerificationHistory.fulfilled populates history array", () => {
        const mockHistory = [
            { id: 1, status: "rejected", rejection_reason: "Document illisible" },
            { id: 2, status: "pending" },
        ];
        const state = verificationReducer(initialState, {
            type: fetchVerificationHistory.fulfilled.type,
            payload: mockHistory,
        });
        expect(state.history.length).toBe(2);
        expect(state.history[0].rejection_reason).toBe("Document illisible");
    });
});

describe("verificationSelectors — Status and relations", () => {
    it("selectVerificationStatus returns not_submitted when no request and no farmer_status", () => {
        const rootState = { verification: { activeRequest: null }, auth: { user: {} } };
        expect(selectVerificationStatus(rootState)).toBe("not_submitted");
    });

    it("selectVerificationStatus returns status from activeRequest", () => {
        const rootState = {
            verification: { activeRequest: { status: "approved" } },
            auth: { user: { farmer_status: "pending" } },
        };
        expect(selectVerificationStatus(rootState)).toBe("approved");
    });

    it("selectVerificationStatus falls back to user.farmer_status if no activeRequest", () => {
        const rootState = {
            verification: { activeRequest: null },
            auth: { user: { farmer_status: "approved" } },
        };
        expect(selectVerificationStatus(rootState)).toBe("approved");
    });

    it("selectVerificationDocuments & selectVerificationReviews", () => {
        const docs = [{ id: 1, document_type: "identity" }];
        const reviews = [{ id: 1, comment: "En cours" }];
        const rootState = {
            verification: {
                activeRequest: { documents: docs, reviews },
            },
        };
        expect(selectVerificationDocuments(rootState)).toEqual(docs);
        expect(selectVerificationReviews(rootState)).toEqual(reviews);
    });
});
