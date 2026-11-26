import { describe, it, expect } from "vitest";
import adminReducer, {
    fetchStats,
    fetchUsers,
    validateFarmer,
    rejectFarmer,
    disableProduct,
    enableProduct,
    deleteProduct,
} from "./adminSlice";

describe("Admin & Pilotage Features (Lot 11)", () => {
    const initialState = {
        users: [],
        farmers: [],
        products: [],
        orders: [],
        harvests: [],
        stats: {},
        loading: false,
        error: null,
    };

    describe("adminSlice — Global Stats", () => {
        it("fetchStats.fulfilled — populates global metrics", () => {
            const mockStats = {
                total_users: 150,
                total_products: 48,
                total_farmers: 35,
                total_customers: 110,
                total_orders: 85,
                total_revenue: 145000,
                delivered_orders: 62,
                active_harvests: 24,
                pending_farmers: 5,
            };

            const state = adminReducer(initialState, {
                type: fetchStats.fulfilled.type,
                payload: mockStats,
            });

            expect(state.stats.total_users).toBe(150);
            expect(state.stats.total_products).toBe(48);
            expect(state.stats.total_revenue).toBe(145000);
            expect(state.stats.pending_farmers).toBe(5);
            expect(state.loading).toBe(false);
        });
    });

    describe("adminSlice — Users Management & Roles", () => {
        it("fetchUsers.fulfilled — stores paginated or array users", () => {
            const mockUsers = [
                { id: 1, name: "Ali Farmer", role: "Farmer", farmer_status: "approved" },
                { id: 2, name: "Hassan Client", role: "Client" },
                { id: 3, name: "Youssef Livreur", role: "Livreur" },
            ];

            const state = adminReducer(initialState, {
                type: fetchUsers.fulfilled.type,
                payload: mockUsers,
            });

            expect(state.users).toHaveLength(3);
            expect(state.users[0].role).toBe("Farmer");
            expect(state.users[1].role).toBe("Client");
            expect(state.users[2].role).toBe("Livreur");
        });

        it("filters users by role correctly", () => {
            const users = [
                { id: 1, role: "Farmer" },
                { id: 2, role: "Client" },
                { id: 3, role: "Client" },
                { id: 4, role: "Livreur" },
                { id: 5, role: "Admin" },
            ];

            const farmers = users.filter((u) => u.role === "Farmer");
            const clients = users.filter((u) => u.role === "Client");
            const livreurs = users.filter((u) => u.role === "Livreur");

            expect(farmers).toHaveLength(1);
            expect(clients).toHaveLength(2);
            expect(livreurs).toHaveLength(1);
        });
    });

    describe("adminSlice — Farmer Verification Workflow", () => {
        it("validateFarmer.fulfilled — updates farmer status to approved", () => {
            const initialFarmers = [
                { id: 10, name: "Farmer A", farmer_status: "pending" },
                { id: 11, name: "Farmer B", farmer_status: "pending" },
            ];

            const prevState = { ...initialState, farmers: initialFarmers };

            const updatedFarmer = { id: 10, name: "Farmer A", farmer_status: "approved" };

            const nextState = adminReducer(prevState, {
                type: validateFarmer.fulfilled.type,
                payload: updatedFarmer,
            });

            const farmerA = nextState.farmers.find((f) => f.id === 10);
            expect(farmerA.farmer_status).toBe("approved");
        });

        it("rejectFarmer.fulfilled — updates farmer status to rejected", () => {
            const initialFarmers = [
                { id: 10, name: "Farmer A", farmer_status: "pending" },
            ];

            const prevState = { ...initialState, farmers: initialFarmers };

            const rejectedFarmer = { id: 10, name: "Farmer A", farmer_status: "rejected" };

            const nextState = adminReducer(prevState, {
                type: rejectFarmer.fulfilled.type,
                payload: rejectedFarmer,
            });

            const farmerA = nextState.farmers.find((f) => f.id === 10);
            expect(farmerA.farmer_status).toBe("rejected");
        });
    });

    describe("adminSlice — Product Moderation", () => {
        it("disableProduct.fulfilled — marks product as disabled", () => {
            const initialProducts = [
                { id: 101, name: "Tomate Souss", is_available: true },
            ];
            const prevState = { ...initialState, products: initialProducts };

            const disabled = { id: 101, name: "Tomate Souss", is_available: false };

            const nextState = adminReducer(prevState, {
                type: disableProduct.fulfilled.type,
                payload: disabled,
            });

            const prod = nextState.products.find((p) => p.id === 101);
            expect(prod.is_available).toBe(false);
        });

        it("enableProduct.fulfilled — marks product as enabled", () => {
            const initialProducts = [
                { id: 101, name: "Tomate Souss", is_available: false },
            ];
            const prevState = { ...initialState, products: initialProducts };

            const enabled = { id: 101, name: "Tomate Souss", is_available: true };

            const nextState = adminReducer(prevState, {
                type: enableProduct.fulfilled.type,
                payload: enabled,
            });

            const prod = nextState.products.find((p) => p.id === 101);
            expect(prod.is_available).toBe(true);
        });

        it("deleteProduct.fulfilled — removes product from list", () => {
            const initialProducts = [
                { id: 101, name: "Tomate Souss" },
                { id: 102, name: "Olives Picholine" },
            ];
            const prevState = { ...initialState, products: initialProducts };

            const nextState = adminReducer(prevState, {
                type: deleteProduct.fulfilled.type,
                payload: 101,
            });

            expect(nextState.products.some((p) => p.id === 101)).toBe(false);
            expect(nextState.products).toHaveLength(1);
        });
    });
});
