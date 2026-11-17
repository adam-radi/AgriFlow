import { describe, it, expect, beforeEach, afterEach } from "vitest";
import orderReducer, {
    addToCart,
    removeFromCart,
    updatePackQuantity,
    clearCart,
    clearOrderError,
    clearOrderSuccess,
    createOrder,
    fetchOrders,
    fetchOrderById,
    fetchFarmerOrders,
    fetchAdminOrders,
} from "./orderSlice";

// Clear localStorage to avoid cart persistence bleeding between tests
beforeEach(() => {
    localStorage.removeItem("agriflow_cart");
});
afterEach(() => {
    localStorage.removeItem("agriflow_cart");
});

const initialState = {
    cartItems: [],
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    success: null,
};

const mockItem = {
    harvestId: 1,
    quantityStandardId: 10,
    unitPrice: 50,
    packQuantity: 2,
    subtotal: 100,
};

describe("orderSlice — cart reducers", () => {
    it("should return initial state", () => {
        const state = orderReducer(undefined, { type: "@@INIT" });
        expect(state.cartItems).toEqual([]);
        expect(state.orders).toEqual([]);
        expect(state.loading).toBe(false);
    });

    it("addToCart — adds new item to cart", () => {
        const state = orderReducer(initialState, addToCart(mockItem));
        expect(state.cartItems.length).toBe(1);
        expect(state.cartItems[0].harvestId).toBe(1);
        expect(state.cartItems[0].packQuantity).toBe(2);
    });

    it("addToCart — increases packQuantity if same item already exists", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const state = orderReducer(stateWithItem, addToCart({ ...mockItem, packQuantity: 3 }));
        expect(state.cartItems.length).toBe(1);
        expect(state.cartItems[0].packQuantity).toBe(5); // 2 + 3
    });

    it("addToCart — adds separate item if different harvestId", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const newItem = { ...mockItem, harvestId: 2 };
        const state = orderReducer(stateWithItem, addToCart(newItem));
        expect(state.cartItems.length).toBe(2);
    });

    it("removeFromCart — removes correct item from cart", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const state = orderReducer(
            stateWithItem,
            removeFromCart({ harvestId: 1, quantityStandardId: 10 })
        );
        expect(state.cartItems.length).toBe(0);
    });

    it("updatePackQuantity — updates quantity and recalculates subtotal", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const state = orderReducer(
            stateWithItem,
            updatePackQuantity({ harvestId: 1, quantityStandardId: 10, packQuantity: 5 })
        );
        expect(state.cartItems[0].packQuantity).toBe(5);
        expect(state.cartItems[0].subtotal).toBe(250); // 50 * 5
    });

    it("updatePackQuantity — does not allow quantity below 1", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const state = orderReducer(
            stateWithItem,
            updatePackQuantity({ harvestId: 1, quantityStandardId: 10, packQuantity: -5 })
        );
        expect(state.cartItems[0].packQuantity).toBe(1); // Math.max(1, -5) = 1
    });

    it("clearCart — empties the cart", () => {
        const stateWithItem = { ...initialState, cartItems: [{ ...mockItem }] };
        const state = orderReducer(stateWithItem, clearCart());
        expect(state.cartItems).toEqual([]);
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

    it("createOrder.fulfilled — clears cart, adds order, sets success message", () => {
        const stateWithCart = { ...initialState, cartItems: [{ ...mockItem }] };
        const newOrder = { id: 99, total_amount: 100, status: "pending" };
        const action = { type: createOrder.fulfilled.type, payload: newOrder };
        const state = orderReducer(stateWithCart, action);
        expect(state.cartItems).toEqual([]);
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
