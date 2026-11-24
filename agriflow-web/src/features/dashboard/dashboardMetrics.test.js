import { describe, it, expect } from "vitest";
import { selectVerificationStatus, selectCanPublish } from "../verification/verificationSelectors";
import { selectFarmerProducts } from "../products/productSelectors";
import { selectFarmerHarvests } from "../harvests/harvestSelectors";
import { selectOrders, selectCartCount, selectCartTotal } from "../orders/orderSelectors";

describe("Phase 08: Dashboards Metrics & State Preconditions", () => {
    describe("Farmer Dashboard Data & Permissions", () => {
        it("handles empty store state gracefully without throwing or inventing stats", () => {
            const state = {
                products: { farmerProducts: [] },
                harvests: { farmerHarvests: [] },
                orders: { orders: [] },
                verification: { activeRequest: null },
                auth: { user: { id: 1, name: "Ahmed Benali", role: "Farmer" } },
            };

            const products = selectFarmerProducts(state);
            const harvests = selectFarmerHarvests(state);
            const orders = selectOrders(state);
            const canPublish = selectCanPublish(state);
            const status = selectVerificationStatus(state);

            expect(products).toEqual([]);
            expect(harvests).toEqual([]);
            expect(orders).toEqual([]);
            expect(canPublish).toBe(false);
            expect(status).toBe("not_submitted");
        });

        it("accurately computes real farmer metrics when products and harvests are present", () => {
            const state = {
                products: {
                    farmerProducts: [
                        { id: 101, name: "Tomates Bio", price: 12, is_available: true },
                        { id: 102, name: "Olives Picholine", price: 35, is_available: false },
                        { id: 103, name: "Oranges Navel", price: 8, is_available: true },
                    ],
                },
                harvests: {
                    farmerHarvests: [
                        { id: 1, product_name: "Tomates", status: "ready" },
                        { id: 2, product_name: "Olives", status: "in_progress" },
                        { id: 3, product_name: "Oranges", status: "planned" },
                    ],
                },
                orders: {
                    orders: [
                        { id: 501, status: "delivered", total: 4500 },
                        { id: 502, status: "pending", total: 1200 },
                    ],
                },
                verification: { activeRequest: { status: "approved" } },
                auth: { user: { id: 1, name: "Ahmed", role: "Farmer" } },
            };

            const products = selectFarmerProducts(state);
            const harvests = selectFarmerHarvests(state);
            const orders = selectOrders(state);

            expect(products.length).toBe(3);
            expect(products.filter((p) => p.is_available !== false).length).toBe(2);
            expect(harvests.length).toBe(3);
            expect(harvests.filter((h) => h.status === "ready" || h.status === "in_progress").length).toBe(2);
            expect(orders.length).toBe(2);
            expect(orders.filter((o) => o.status === "delivered").length).toBe(1);
            expect(selectCanPublish(state)).toBe(true);
            expect(selectVerificationStatus(state)).toBe("approved");
        });
    });

    describe("Client Dashboard Data & B2B Sourcing Metrics", () => {
        it("handles empty client orders and cart state gracefully", () => {
            const state = {
                orders: { orders: [] },
                cart: { items: [], count: 0, total: 0 },
                verification: { activeRequest: null },
                auth: { user: { id: 2, name: "Supermarché Atlas", role: "Client" } },
            };

            const orders = selectOrders(state);
            const cartCount = selectCartCount(state);
            const cartTotal = selectCartTotal(state);
            const status = selectVerificationStatus(state);

            expect(orders).toEqual([]);
            expect(cartCount).toBe(0);
            expect(cartTotal).toBe(0);
            expect(status).toBe("not_submitted");
        });

        it("accurately categorizes active vs delivered orders and computes cart summary", () => {
            const state = {
                orders: {
                    orders: [
                        { id: 1, status: "pending", total: 2400 },
                        { id: 2, status: "in_delivery", total: 1800 },
                        { id: 3, status: "delivered", total: 5200 },
                        { id: 4, status: "completed", total: 3100 },
                    ],
                },
                cart: {
                    items: [{ id: 1, product_id: 101, quantity: 50 }],
                    count: 2,
                    total: 3500,
                },
                verification: { activeRequest: { status: "approved" } },
                auth: { user: { id: 2, name: "Épicerie Verte", role: "Client" } },
            };

            const orders = selectOrders(state);
            const cartCount = selectCartCount(state);
            const cartTotal = selectCartTotal(state);

            const activeOrders = orders.filter(
                (o) => o.status === "pending" || o.status === "processing" || o.status === "in_delivery"
            );
            const completedOrders = orders.filter(
                (o) => o.status === "delivered" || o.status === "completed"
            );

            expect(orders.length).toBe(4);
            expect(activeOrders.length).toBe(2);
            expect(completedOrders.length).toBe(2);
            expect(cartCount).toBe(2);
            expect(cartTotal).toBe(3500);
            expect(selectVerificationStatus(state)).toBe("approved");
        });
    });
});
