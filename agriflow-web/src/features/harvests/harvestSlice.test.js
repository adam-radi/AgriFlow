import { describe, it, expect } from "vitest";
import harvestReducer, {
    setFilters,
    clearSelectedHarvest,
    clearHarvestError,
    clearHarvestSuccess,
    fetchHarvests,
    fetchFarmerHarvests,
    createHarvest,
    updateHarvest,
    deleteHarvest,
    fetchAdminHarvests,
} from "./harvestSlice";

const initialState = {
    harvests: [],
    selectedHarvest: null,
    farmerHarvests: [],
    adminHarvests: [],
    forecast: null,
    orders: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    },
    filters: {
        search: "",
        status: "",
    },
    loading: false,
    error: null,
    successMessage: null,
};

describe("harvestSlice — reducers", () => {
    it("should return the initial state", () => {
        expect(harvestReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
    });

    it("setFilters — merges filters", () => {
        const state = harvestReducer(initialState, setFilters({ status: "active" }));
        expect(state.filters.status).toBe("active");
        expect(state.filters.search).toBe(""); // original preserved
    });

    it("clearSelectedHarvest — clears selectedHarvest, forecast, and orders", () => {
        const withData = {
            ...initialState,
            selectedHarvest: { id: 1 },
            forecast: { yield: 100 },
            orders: [{ id: 10 }],
        };
        const state = harvestReducer(withData, clearSelectedHarvest());
        expect(state.selectedHarvest).toBeNull();
        expect(state.forecast).toBeNull();
        expect(state.orders).toEqual([]);
    });

    it("clearHarvestError — sets error to null", () => {
        const stateWithError = { ...initialState, error: "Some error" };
        const state = harvestReducer(stateWithError, clearHarvestError());
        expect(state.error).toBeNull();
    });

    it("clearHarvestSuccess — sets successMessage to null", () => {
        const stateWithSuccess = { ...initialState, successMessage: "Done" };
        const state = harvestReducer(stateWithSuccess, clearHarvestSuccess());
        expect(state.successMessage).toBeNull();
    });
});

describe("harvestSlice — fetchHarvests thunk", () => {
    it("fetchHarvests.pending — loading=true, clears error", () => {
        const state = harvestReducer(initialState, { type: fetchHarvests.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("fetchHarvests.fulfilled with array payload", () => {
        const mockHarvests = [{ id: 1, status: "active" }, { id: 2, status: "planned" }];
        const action = { type: fetchHarvests.fulfilled.type, payload: mockHarvests };
        const state = harvestReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.harvests).toEqual(mockHarvests);
    });

    it("fetchHarvests.fulfilled with paginated object payload", () => {
        const payload = {
            data: [{ id: 1 }, { id: 2 }],
            meta: { total: 2, last_page: 1 },
        };
        // The slice has: state.harvests = data.results ?? data.harvests ?? data.data ?? []
        // Since payload is an object with .data array:
        const action = { type: fetchHarvests.fulfilled.type, payload };
        const state = harvestReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.harvests).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("fetchHarvests.rejected — sets error", () => {
        const action = { type: fetchHarvests.rejected.type, payload: "Failed to load harvests" };
        const state = harvestReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Failed to load harvests");
    });
});

describe("harvestSlice — fetchFarmerHarvests thunk", () => {
    it("fetchFarmerHarvests.fulfilled with array", () => {
        const data = [{ id: 10, status: "planned" }];
        const action = { type: fetchFarmerHarvests.fulfilled.type, payload: data };
        const state = harvestReducer(initialState, action);
        expect(state.farmerHarvests).toEqual(data);
    });
});

describe("harvestSlice — createHarvest thunk", () => {
    it("createHarvest.pending — sets loading=true, clears messages", () => {
        const state = harvestReducer(initialState, { type: createHarvest.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.successMessage).toBeNull();
    });

    it("createHarvest.fulfilled — prepends new harvest to farmerHarvests", () => {
        const existing = { ...initialState, farmerHarvests: [{ id: 1, status: "planned" }] };
        const newHarvest = { id: 2, status: "active" };
        const action = { type: createHarvest.fulfilled.type, payload: newHarvest };
        const state = harvestReducer(existing, action);
        expect(state.farmerHarvests[0]).toEqual(newHarvest);
        expect(state.farmerHarvests.length).toBe(2);
        expect(state.successMessage).toBe("Harvest created successfully!");
    });

    it("createHarvest.rejected — sets error", () => {
        const action = { type: createHarvest.rejected.type, payload: "Failed to create harvest" };
        const state = harvestReducer(initialState, action);
        expect(state.error).toBe("Failed to create harvest");
    });
});

describe("harvestSlice — updateHarvest thunk", () => {
    it("updateHarvest.fulfilled — updates harvest in farmerHarvests and selectedHarvest", () => {
        const stateWithHarvests = {
            ...initialState,
            farmerHarvests: [{ id: 1, status: "planned" }, { id: 2, status: "active" }],
            selectedHarvest: { id: 1, status: "planned" },
        };
        const updated = { id: 1, status: "active" };
        const action = { type: updateHarvest.fulfilled.type, payload: updated };
        const state = harvestReducer(stateWithHarvests, action);
        expect(state.farmerHarvests[0].status).toBe("active");
        expect(state.selectedHarvest.status).toBe("active");
        expect(state.successMessage).toBe("Harvest updated successfully!");
    });

    it("updateHarvest.fulfilled — status transition: planned → active works", () => {
        const stateWithHarvests = {
            ...initialState,
            farmerHarvests: [{ id: 5, status: "planned" }],
        };
        const updated = { id: 5, status: "active" };
        const action = { type: updateHarvest.fulfilled.type, payload: updated };
        const state = harvestReducer(stateWithHarvests, action);
        expect(state.farmerHarvests[0].status).toBe("active");
    });

    it("updateHarvest.fulfilled — status transition: active → completed works", () => {
        const stateWithHarvests = {
            ...initialState,
            farmerHarvests: [{ id: 5, status: "active" }],
        };
        const updated = { id: 5, status: "completed" };
        const action = { type: updateHarvest.fulfilled.type, payload: updated };
        const state = harvestReducer(stateWithHarvests, action);
        expect(state.farmerHarvests[0].status).toBe("completed");
    });
});

describe("harvestSlice — deleteHarvest thunk", () => {
    it("deleteHarvest.fulfilled — removes harvest from all lists", () => {
        const stateWithData = {
            ...initialState,
            farmerHarvests: [{ id: 1 }, { id: 2 }],
            harvests: [{ id: 1 }, { id: 2 }],
            adminHarvests: [{ id: 1 }, { id: 2 }],
        };
        const action = { type: deleteHarvest.fulfilled.type, payload: 1 };
        const state = harvestReducer(stateWithData, action);
        expect(state.farmerHarvests).toEqual([{ id: 2 }]);
        expect(state.harvests).toEqual([{ id: 2 }]);
        expect(state.adminHarvests).toEqual([{ id: 2 }]);
        expect(state.successMessage).toBe("Harvest deleted.");
    });
});

describe("harvestSlice — fetchAdminHarvests thunk", () => {
    it("fetchAdminHarvests.fulfilled with array", () => {
        const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const action = { type: fetchAdminHarvests.fulfilled.type, payload: data };
        const state = harvestReducer(initialState, action);
        expect(state.adminHarvests).toEqual(data);
    });
});
