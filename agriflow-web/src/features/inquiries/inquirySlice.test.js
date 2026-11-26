import { describe, it, expect } from "vitest";
import inquiryReducer, {
    clearInquiryError,
    clearInquirySuccess,
    clearCurrentInquiry,
    fetchInquiries,
    fetchInquiryById,
    createInquiry,
    submitCounterOffer,
    acceptInquiryOffer,
    confirmInquiryAgreement,
    updateInquiryDeliveryStatus,
} from "./inquirySlice";
import {
    selectInquiries,
    selectCurrentInquiry,
    selectInquiryLoading,
    selectInquiryActionLoading,
    selectInquiryError,
    selectInquirySuccessMessage,
} from "./inquirySelectors";

const initialState = {
    inquiries: [],
    currentInquiry: null,
    loading: false,
    actionLoading: false,
    error: null,
    successMessage: null,
};

describe("inquirySlice reducers & thunks", () => {
    it("returns correct initial state", () => {
        const state = inquiryReducer(undefined, { type: "@@INIT" });
        expect(state.inquiries).toEqual([]);
        expect(state.currentInquiry).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.actionLoading).toBe(false);
    });

    it("clearInquiryError sets error to null", () => {
        const state = inquiryReducer({ ...initialState, error: "Erreur" }, clearInquiryError());
        expect(state.error).toBeNull();
    });

    it("clearInquirySuccess sets successMessage to null", () => {
        const state = inquiryReducer({ ...initialState, successMessage: "Bravo" }, clearInquirySuccess());
        expect(state.successMessage).toBeNull();
    });

    it("clearCurrentInquiry clears currentInquiry", () => {
        const state = inquiryReducer({ ...initialState, currentInquiry: { id: 1 } }, clearCurrentInquiry());
        expect(state.currentInquiry).toBeNull();
    });

    it("fetchInquiries.fulfilled populates inquiries", () => {
        const payload = [{ id: 1, status: "pending" }, { id: 2, status: "negotiating" }];
        const state = inquiryReducer(initialState, { type: fetchInquiries.fulfilled.type, payload });
        expect(state.inquiries).toHaveLength(2);
        expect(state.loading).toBe(false);
    });

    it("createInquiry.fulfilled prepends new inquiry and sets currentInquiry", () => {
        const existing = [{ id: 1, status: "pending" }];
        const newInquiry = { id: 2, status: "pending", current_price: 15 };
        const state = inquiryReducer(
            { ...initialState, inquiries: existing },
            { type: createInquiry.fulfilled.type, payload: newInquiry }
        );
        expect(state.inquiries).toHaveLength(2);
        expect(state.inquiries[0].id).toBe(2);
        expect(state.currentInquiry.id).toBe(2);
        expect(state.successMessage).toBeTruthy();
    });

    it("submitCounterOffer.fulfilled updates inquiry in list and currentInquiry", () => {
        const existing = [{ id: 1, status: "pending", current_price: 10 }];
        const updated = { id: 1, status: "negotiating", current_price: 12 };
        const state = inquiryReducer(
            { ...initialState, inquiries: existing, currentInquiry: existing[0] },
            { type: submitCounterOffer.fulfilled.type, payload: updated }
        );
        expect(state.currentInquiry.current_price).toBe(12);
        expect(state.inquiries[0].current_price).toBe(12);
        expect(state.inquiries[0].status).toBe("negotiating");
    });

    it("acceptInquiryOffer.fulfilled updates status to accepted", () => {
        const existing = [{ id: 5, status: "negotiating" }];
        const updated = { id: 5, status: "accepted" };
        const state = inquiryReducer(
            { ...initialState, inquiries: existing, currentInquiry: existing[0] },
            { type: acceptInquiryOffer.fulfilled.type, payload: updated }
        );
        expect(state.currentInquiry.status).toBe("accepted");
        expect(state.inquiries[0].status).toBe("accepted");
    });

    it("confirmInquiryAgreement.fulfilled updates status to confirmed", () => {
        const existing = [{ id: 5, status: "accepted" }];
        const updated = { id: 5, status: "confirmed" };
        const state = inquiryReducer(
            { ...initialState, inquiries: existing, currentInquiry: existing[0] },
            { type: confirmInquiryAgreement.fulfilled.type, payload: updated }
        );
        expect(state.currentInquiry.status).toBe("confirmed");
        expect(state.inquiries[0].status).toBe("confirmed");
    });

    it("updateInquiryDeliveryStatus.fulfilled updates delivery status", () => {
        const existing = [{ id: 8, status: "confirmed" }];
        const updated = { id: 8, status: "in_delivery" };
        const state = inquiryReducer(
            { ...initialState, inquiries: existing, currentInquiry: existing[0] },
            { type: updateInquiryDeliveryStatus.fulfilled.type, payload: updated }
        );
        expect(state.currentInquiry.status).toBe("in_delivery");
    });
});

describe("inquirySelectors", () => {
    const rootState = {
        inquiries: {
            inquiries: [{ id: 1, current_price: 20 }],
            currentInquiry: { id: 1, current_price: 20 },
            loading: false,
            actionLoading: true,
            error: "Error message",
            successMessage: "Success message",
        },
    };

    it("extracts state fields accurately", () => {
        expect(selectInquiries(rootState)).toHaveLength(1);
        expect(selectCurrentInquiry(rootState)?.id).toBe(1);
        expect(selectInquiryLoading(rootState)).toBe(false);
        expect(selectInquiryActionLoading(rootState)).toBe(true);
        expect(selectInquiryError(rootState)).toBe("Error message");
        expect(selectInquirySuccessMessage(rootState)).toBe("Success message");
    });
});
