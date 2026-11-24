import { describe, it, expect } from "vitest";
import orderReducer, {
    clearOrderError,
    clearOrderSuccess,
    createOrder,
    fetchOrders,
    fetchOrderById,
    fetchAdminOrders,
} from "./orderSlice";

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: null,
};

describe("orderSlice — order reducers", () => {
    it("should return initial state", () => {
        const state = orderReducer(undefined, { type: "@@INIT" });
        expect(state.orders).toEqual([]);
        expect(state.loading).toBe(false);
    });

    it("clearOrderError — sets error to null", () => {
        const stateWithError = { ...initialState, error: "Some error" };
        const state = orderReducer(stateWithError, clearOrderError());
        expect(state.error).toBeNull();
    });

    it("clearOrderSuccess — sets success to null", () => {
        const stateWithSuccess = { ...initialState, success: "Order placed!" };
        const state = orderReducer(stateWithSuccess, clearOrderSuccess());
        expect(state.success).toBeNull();
    });
});

describe("orderSlice — createOrder thunk", () => {
    it("createOrder.pending — loading=true, clears error and success", () => {
        const state = orderReducer(initialState, { type: createOrder.pending.type });
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.success).toBeNull();
    });

    it("createOrder.fulfilled — adds order, sets currentOrder and success message", () => {
        const newOrder = { id: 99, total_amount: 100, status: "pending" };
        const action = { type: createOrder.fulfilled.type, payload: newOrder };
        const state = orderReducer(initialState, action);
        expect(state.orders[0]).toEqual(newOrder);
        expect(state.currentOrder).toEqual(newOrder);
        expect(state.success).toBe("Order placed successfully!");
    });

    it("createOrder.rejected — sets error", () => {
        const action = { type: createOrder.rejected.type, payload: "Insufficient stock" };
        const state = orderReducer(initialState, action);
        expect(state.error).toBe("Insufficient stock");
    });
});

describe("orderSlice — fetchOrders thunk", () => {
    it("fetchOrders.fulfilled — populates orders array", () => {
        const mockOrders = [{ id: 1, status: "pending" }, { id: 2, status: "delivered" }];
        const action = { type: fetchOrders.fulfilled.type, payload: mockOrders };
        const state = orderReducer(initialState, action);
        expect(state.orders).toEqual(mockOrders);
        expect(state.loading).toBe(false);
    });

    it("fetchOrders.rejected — sets error", () => {
        const action = { type: fetchOrders.rejected.type, payload: "Failed to load orders" };
        const state = orderReducer(initialState, action);
        expect(state.error).toBe("Failed to load orders");
    });
});

describe("orderSlice — fetchOrderById thunk", () => {
    it("fetchOrderById.pending — clears currentOrder", () => {
        const stateWithOrder = { ...initialState, currentOrder: { id: 1 } };
        const state = orderReducer(stateWithOrder, { type: fetchOrderById.pending.type });
        expect(state.currentOrder).toBeNull();
        expect(state.loading).toBe(true);
    });

    it("fetchOrderById.fulfilled — sets currentOrder", () => {
        const order = { id: 5, status: "confirmed", total_amount: 500 };
        const action = { type: fetchOrderById.fulfilled.type, payload: order };
        const state = orderReducer(initialState, action);
        expect(state.currentOrder).toEqual(order);
    });
});

describe("orderSlice — order status lifecycle", () => {
    it("fetchAdminOrders.fulfilled — supports all status values in orders array", () => {
        const orders = [
            { id: 1, status: "pending" },
            { id: 2, status: "confirmed" },
            { id: 3, status: "processing" },
            { id: 4, status: "delivered" },
            { id: 5, status: "cancelled" },
        ];
        const action = { type: fetchAdminOrders.fulfilled.type, payload: orders };
        const state = orderReducer(initialState, action);
        const statuses = state.orders.map((o) => o.status);
        expect(statuses).toContain("pending");
        expect(statuses).toContain("confirmed");
        expect(statuses).toContain("processing");
        expect(statuses).toContain("delivered");
        expect(statuses).toContain("cancelled");
    });
});
