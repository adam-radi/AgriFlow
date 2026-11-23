import { describe, it, expect } from "vitest";
import {
    selectVerificationStatus,
    selectIsVerified,
    selectIsPending,
    selectIsRejected,
    selectIsNotSubmitted,
    selectCanPublish,
} from "./verificationSelectors";

describe("Phase 07: Verification Access Control Selectors", () => {
    it("returns 'not_submitted' and canPublish=false by default", () => {
        const state = {
            verification: { activeRequest: null },
            auth: { user: null },
        };
        expect(selectVerificationStatus(state)).toBe("not_submitted");
        expect(selectIsVerified(state)).toBe(false);
        expect(selectCanPublish(state)).toBe(false);
        expect(selectIsNotSubmitted(state)).toBe(true);
        expect(selectIsPending(state)).toBe(false);
        expect(selectIsRejected(state)).toBe(false);
    });

    it("identifies pending and under_review states", () => {
        const statePending = {
            verification: { activeRequest: { status: "pending" } },
            auth: { user: { role: "Farmer" } },
        };
        expect(selectVerificationStatus(statePending)).toBe("pending");
        expect(selectIsPending(statePending)).toBe(true);
        expect(selectCanPublish(statePending)).toBe(false);

        const stateUnderReview = {
            verification: { activeRequest: { status: "under_review" } },
            auth: { user: { role: "Farmer" } },
        };
        expect(selectIsPending(stateUnderReview)).toBe(true);
        expect(selectCanPublish(stateUnderReview)).toBe(false);
    });

    it("identifies rejected and additional_information_required states", () => {
        const stateRejected = {
            verification: { activeRequest: { status: "rejected" } },
            auth: { user: { role: "Farmer" } },
        };
        expect(selectVerificationStatus(stateRejected)).toBe("rejected");
        expect(selectIsRejected(stateRejected)).toBe(true);
        expect(selectCanPublish(stateRejected)).toBe(false);

        const stateInfo = {
            verification: { activeRequest: { status: "additional_information_required" } },
            auth: { user: { role: "Farmer" } },
        };
        expect(selectIsRejected(stateInfo)).toBe(true);
        expect(selectCanPublish(stateInfo)).toBe(false);
    });

    it("identifies approved state and unlocks canPublish", () => {
        const stateApproved = {
            verification: { activeRequest: { status: "approved" } },
            auth: { user: { role: "Farmer" } },
        };
        expect(selectVerificationStatus(stateApproved)).toBe("approved");
        expect(selectIsVerified(stateApproved)).toBe(true);
        expect(selectCanPublish(stateApproved)).toBe(true);
        expect(selectIsPending(stateApproved)).toBe(false);
        expect(selectIsRejected(stateApproved)).toBe(false);
    });

    it("falls back to user.farmer_status when activeRequest is absent", () => {
        const stateLegacyApproved = {
            verification: { activeRequest: null },
            auth: { user: { role: "Farmer", farmer_status: "approved" } },
        };
        expect(selectVerificationStatus(stateLegacyApproved)).toBe("approved");
        expect(selectIsVerified(stateLegacyApproved)).toBe(true);
        expect(selectCanPublish(stateLegacyApproved)).toBe(true);

        const stateLegacyPending = {
            verification: { activeRequest: null },
            auth: { user: { role: "Farmer", farmer_status: "pending" } },
        };
        expect(selectVerificationStatus(stateLegacyPending)).toBe("pending");
        expect(selectIsPending(stateLegacyPending)).toBe(true);
        expect(selectCanPublish(stateLegacyPending)).toBe(false);
    });
});
