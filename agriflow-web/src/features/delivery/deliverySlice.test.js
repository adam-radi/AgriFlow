import { describe, it, expect } from "vitest";
import deliveryReducer, {
    setSelectedGroup,
    clearSelectedGroup,
    setFilters,
    clearDeliveryError,
    clearDeliverySuccess,
    fetchDeliveryGroups,
    fetchDeliveryGroupDetails,
    createDeliveryGroup,
    assignLivreurToGroup,
    updateDeliveryStatus,
} from "./deliverySlice";

const initialState = {
    groups: [],
    selectedGroup: null,
    loading: false,
    error: null,
    success: null,
    filters: {
        zone: null,
        status: null,
        date: null,
    },
};

describe("deliverySlice — reducers", () => {
    it("should return initial state", () => {
        expect(deliveryReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("setSelectedGroup — sets selectedGroup", () => {
        const group = { id: 1, status: "pending" };
        const state = deliveryReducer(initialState, setSelectedGroup(group));
        expect(state.selectedGroup).toEqual(group);
    });

    it("clearSelectedGroup — sets selectedGroup to null", () => {
        const stateWithGroup = { ...initialState, selectedGroup: { id: 1 } };
        const state = deliveryReducer(stateWithGroup, clearSelectedGroup());
        expect(state.selectedGroup).toBeNull();
    });

    it("setFilters — merges filters", () => {
        const state = deliveryReducer(initialState, setFilters({ zone: "Agadir" }));
        expect(state.filters.zone).toBe("Agadir");
        expect(state.filters.status).toBeNull();
    });

    it("clearDeliveryError — clears error", () => {
        const stateWithError = { ...initialState, error: "Error!" };
        const state = deliveryReducer(stateWithError, clearDeliveryError());
        expect(state.error).toBeNull();
    });

    it("clearDeliverySuccess — clears success", () => {
        const stateWithSuccess = { ...initialState, success: "Done!" };
        const state = deliveryReducer(stateWithSuccess, clearDeliverySuccess());
        expect(state.success).toBeNull();
    });
});

describe("deliverySlice — fetchDeliveryGroups thunk", () => {
    it("fetchDeliveryGroups.pending — sets loading=true", () => {
        const state = deliveryReducer(initialState, { type: fetchDeliveryGroups.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("fetchDeliveryGroups.fulfilled with array", () => {
        const groups = [{ id: 1, status: "pending" }, { id: 2, status: "in_transit" }];
        const action = { type: fetchDeliveryGroups.fulfilled.type, payload: groups };
        const state = deliveryReducer(initialState, action);
        expect(state.groups).toEqual(groups);
        expect(state.loading).toBe(false);
    });

    it("fetchDeliveryGroups.rejected — sets error", () => {
        const action = { type: fetchDeliveryGroups.rejected.type, payload: "Failed to load" };
        const state = deliveryReducer(initialState, action);
        expect(state.error).toBe("Failed to load");
    });
});

describe("deliverySlice — fetchDeliveryGroupDetails thunk", () => {
    it("fetchDeliveryGroupDetails.pending — clears selectedGroup", () => {
        const stateWithGroup = { ...initialState, selectedGroup: { id: 1 } };
        const state = deliveryReducer(stateWithGroup, { type: fetchDeliveryGroupDetails.pending.type });
        expect(state.selectedGroup).toBeNull();
        expect(state.loading).toBe(true);
    });

    it("fetchDeliveryGroupDetails.fulfilled — sets selectedGroup", () => {
        const group = { id: 5, status: "in_transit", orders: [] };
        const action = { type: fetchDeliveryGroupDetails.fulfilled.type, payload: group };
        const state = deliveryReducer(initialState, action);
        expect(state.selectedGroup).toEqual(group);
    });
});

describe("deliverySlice — createDeliveryGroup thunk", () => {
    it("createDeliveryGroup.fulfilled — prepends new group to groups list", () => {
        const existing = { ...initialState, groups: [{ id: 1 }] };
        const newGroup = { id: 2, status: "pending" };
        const action = { type: createDeliveryGroup.fulfilled.type, payload: newGroup };
        const state = deliveryReducer(existing, action);
        expect(state.groups[0]).toEqual(newGroup);
        expect(state.groups.length).toBe(2);
        expect(state.success).toBe("Delivery group created!");
    });
});

describe("deliverySlice — updateDeliveryStatus thunk (status lifecycle)", () => {
    it("updateDeliveryStatus.fulfilled — Pending → In Transit", () => {
        const stateWithGroup = {
            ...initialState,
            groups: [{ id: 1, status: "pending" }],
            selectedGroup: { id: 1, status: "pending" },
        };
        const updated = { id: 1, status: "in_transit" };
        const action = { type: updateDeliveryStatus.fulfilled.type, payload: updated };
        const state = deliveryReducer(stateWithGroup, action);
        expect(state.groups[0].status).toBe("in_transit");
        expect(state.selectedGroup.status).toBe("in_transit");
        expect(state.success).toBe("Status updated!");
    });

    it("updateDeliveryStatus.fulfilled — In Transit → Delivered", () => {
        const stateWithGroup = {
            ...initialState,
            groups: [{ id: 1, status: "in_transit" }],
            selectedGroup: { id: 1, status: "in_transit" },
        };
        const updated = { id: 1, status: "delivered" };
        const action = { type: updateDeliveryStatus.fulfilled.type, payload: updated };
        const state = deliveryReducer(stateWithGroup, action);
        expect(state.groups[0].status).toBe("delivered");
        expect(state.selectedGroup.status).toBe("delivered");
    });

    it("updateDeliveryStatus.rejected — sets error", () => {
        const action = { type: updateDeliveryStatus.rejected.type, payload: "Not allowed" };
        const state = deliveryReducer(initialState, action);
        expect(state.error).toBe("Not allowed");
    });
});

describe("deliverySlice — assignLivreurToGroup thunk", () => {
    it("assignLivreurToGroup.fulfilled — updates group in list and selectedGroup", () => {
        const stateWithGroup = {
            ...initialState,
            groups: [{ id: 1, livreur_id: null }],
            selectedGroup: { id: 1, livreur_id: null },
        };
        const updated = { id: 1, livreur_id: 5 };
        const action = { type: assignLivreurToGroup.fulfilled.type, payload: updated };
        const state = deliveryReducer(stateWithGroup, action);
        expect(state.groups[0].livreur_id).toBe(5);
        expect(state.selectedGroup.livreur_id).toBe(5);
        expect(state.success).toBe("Livreur assigned!");
    });
});
