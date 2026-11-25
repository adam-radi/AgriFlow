import { describe, it, expect } from "vitest";
import orderReducer, {
    cancelOrder,
    fetchOrders,
    createOrder,
} from "./orderSlice";
import cartReducer, {
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "./cartSlice";

describe("Buyer Journey & Transactions (Lot 10)", () => {
    describe("orderSlice — cancelOrder thunk", () => {
        it("cancelOrder.pending — sets loading=true and clears error", () => {
            const state = orderReducer(
                { orders: [], currentOrder: null, loading: false, error: "Previous error", success: null },
                { type: cancelOrder.pending.type }
            );
            expect(state.loading).toBe(true);
            expect(state.error).toBeNull();
        });

        it("cancelOrder.fulfilled — updates order status in orders list and currentOrder", () => {
            const existingOrder = { id: 42, status: "pending", total_amount: 1500 };
            const otherOrder = { id: 43, status: "confirmed", total_amount: 800 };
            const cancelledOrder = { id: 42, status: "cancelled", total_amount: 1500 };

            const prevState = {
                orders: [existingOrder, otherOrder],
                currentOrder: existingOrder,
                loading: true,
                error: null,
                success: null,
            };

            const nextState = orderReducer(prevState, {
                type: cancelOrder.fulfilled.type,
                payload: cancelledOrder,
            });

            expect(nextState.loading).toBe(false);
            expect(nextState.orders.find((o) => o.id === 42).status).toBe("cancelled");
            expect(nextState.orders.find((o) => o.id === 43).status).toBe("confirmed");
            expect(nextState.currentOrder.status).toBe("cancelled");
            expect(nextState.success).toContain("annulée");
        });

        it("cancelOrder.rejected — sets error message", () => {
            const state = orderReducer(
                { orders: [], currentOrder: null, loading: true, error: null, success: null },
                { type: cancelOrder.rejected.type, payload: "Impossible d'annuler" }
            );
            expect(state.loading).toBe(false);
            expect(state.error).toBe("Impossible d'annuler");
        });
    });

    describe("cartSlice — Cart management lifecycle", () => {
        it("fetchCart.fulfilled — populates items, total and count", () => {
            const mockCart = {
                items: [
                    { id: 1, harvest_id: 10, quantity: 2, unit_price: 100, subtotal: 200 },
                    { id: 2, harvest_id: 12, quantity: 3, unit_price: 50, subtotal: 150 },
                ],
                total: 350,
                count: 5,
            };

            const state = cartReducer(
                { cart: null, items: [], total: 0, count: 0, loading: true, error: null },
                { type: fetchCart.fulfilled.type, payload: mockCart }
            );

            expect(state.items.length).toBe(2);
            expect(state.total).toBe(350);
            expect(state.count).toBe(5);
            expect(state.loading).toBe(false);
        });

        it("clearCart.fulfilled — resets cart items to empty", () => {
            const state = cartReducer(
                {
                    cart: { items: [{ id: 1 }] },
                    items: [{ id: 1 }],
                    total: 100,
                    count: 1,
                    loading: true,
                    error: null,
                },
                { type: clearCart.fulfilled.type, payload: { items: [], total: 0, count: 0 } }
            );

            expect(state.items).toEqual([]);
            expect(state.total).toBe(0);
            expect(state.count).toBe(0);
        });
    });

    describe("Order filtering & KPI computation logic", () => {
        const sampleOrders = [
            { id: 1, status: "pending", total_amount: 1000 },
            { id: 2, status: "confirmed", total_amount: 2500 },
            { id: 3, status: "processing", total_amount: 1200 },
            { id: 4, status: "in_delivery", total_amount: 800 },
            { id: 5, status: "delivered", total_amount: 4000 },
            { id: 6, status: "cancelled", total_amount: 1500 },
        ];

        it("correctly identifies active orders (in progress / shipment)", () => {
            const activeOrders = sampleOrders.filter(
                (o) =>
                    o.status === "pending" ||
                    o.status === "confirmed" ||
                    o.status === "processing" ||
                    o.status === "in_delivery"
            );
            expect(activeOrders.length).toBe(4);
        });

        it("correctly identifies delivered orders", () => {
            const delivered = sampleOrders.filter((o) => o.status === "delivered");
            expect(delivered.length).toBe(1);
            expect(delivered[0].id).toBe(5);
        });

        it("calculates total spent excluding cancelled orders", () => {
            const totalSpent = sampleOrders
                .filter((o) => o.status !== "cancelled")
                .reduce((acc, curr) => acc + curr.total_amount, 0);
            expect(totalSpent).toBe(1000 + 2500 + 1200 + 800 + 4000);
            expect(totalSpent).toBe(9500);
        });
    });

    describe("Checkout payload construction", () => {
        it("constructs compliant payload for backend StoreOrderRequest", () => {
            const cartItems = [
                {
                    id: 1,
                    harvest_id: 101,
                    quantity_standard_id: 5,
                    quantity: 4,
                    harvest: { start_date: "2026-11-20" },
                },
            ];

            const zone = "Souss-Massa";
            const deliveryDate = "2026-12-05";

            const payload = {
                zone,
                delivery_date: deliveryDate,
                items: cartItems.map((item) => ({
                    harvest_id: item.harvest_id,
                    quantity_standard_id: item.quantity_standard_id,
                    quantity: item.quantity,
                    scheduled_harvest_date: item.harvest?.start_date || null,
                })),
            };

            expect(payload.zone).toBe("Souss-Massa");
            expect(payload.delivery_date).toBe("2026-12-05");
            expect(payload.items).toHaveLength(1);
            expect(payload.items[0]).toEqual({
                harvest_id: 101,
                quantity_standard_id: 5,
                quantity: 4,
                scheduled_harvest_date: "2026-11-20",
            });
        });
    });
});
