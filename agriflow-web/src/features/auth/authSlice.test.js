import { describe, it, expect, beforeEach, afterEach } from "vitest";
import authReducer, {
    setCredentials,
    logout,
    updateUser,
    clearError,
    clearSuccess,
} from "./authSlice";
import { loginUser, registerClient, registerFarmer, logoutUser } from "./authThunks";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    successMessage: null,
};

// Clear localStorage before each test to get a clean slate
beforeEach(() => {
    localStorage.clear();
});
afterEach(() => {
    localStorage.clear();
});

describe("authSlice — reducers", () => {
    it("should return the initial state", () => {
        const state = authReducer(undefined, { type: "@@INIT" });
        expect(state.isAuthenticated).toBe(false);
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.successMessage).toBeNull();
    });

    it("setCredentials — sets user, token, isAuthenticated and persists to localStorage", () => {
        const mockUser = { id: 1, name: "Ahmed", role: "Farmer" };
        const mockToken = "abc123";
        const state = authReducer(initialState, setCredentials({ user: mockUser, token: mockToken }));

        expect(state.user).toEqual(mockUser);
        expect(state.token).toBe(mockToken);
        expect(state.isAuthenticated).toBe(true);
        expect(localStorage.getItem("token")).toBe(mockToken);
        expect(JSON.parse(localStorage.getItem("user"))).toEqual(mockUser);
    });

    it("logout — clears user, token, isAuthenticated and removes from localStorage", () => {
        localStorage.setItem("token", "abc123");
        localStorage.setItem("user", JSON.stringify({ id: 1 }));

        const loggedInState = {
            ...initialState,
            user: { id: 1, name: "Ahmed" },
            token: "abc123",
            isAuthenticated: true,
        };
        const state = authReducer(loggedInState, logout());

        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("user")).toBeNull();
    });

    it("updateUser — merges new fields into existing user", () => {
        const stateWithUser = {
            ...initialState,
            user: { id: 1, name: "Ahmed", role: "Farmer" },
        };
        const state = authReducer(stateWithUser, updateUser({ name: "Ahmed Updated" }));
        expect(state.user.name).toBe("Ahmed Updated");
        expect(state.user.role).toBe("Farmer");
    });

    it("clearError — sets error to null", () => {
        const stateWithError = { ...initialState, error: "Login failed" };
        const state = authReducer(stateWithError, clearError());
        expect(state.error).toBeNull();
    });

    it("clearSuccess — sets successMessage to null", () => {
        const stateWithSuccess = { ...initialState, successMessage: "Done!" };
        const state = authReducer(stateWithSuccess, clearSuccess());
        expect(state.successMessage).toBeNull();
    });
});

describe("authSlice — loginUser thunk", () => {
    it("loginUser.pending — sets loading=true, clears error", () => {
        const action = { type: loginUser.pending.type };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("loginUser.fulfilled — sets user, token, isAuthenticated", () => {
        const action = {
            type: loginUser.fulfilled.type,
            payload: { user: { id: 1, name: "Ahmed", role: "Farmer" }, token: "token123" },
        };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual({ id: 1, name: "Ahmed", role: "Farmer" });
        expect(state.token).toBe("token123");
    });

    it("loginUser.rejected — sets loading=false and stores error", () => {
        const action = { type: loginUser.rejected.type, payload: "Invalid credentials" };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Invalid credentials");
    });
});

describe("authSlice — registerClient thunk", () => {
    it("registerClient.pending — sets loading=true, clears error and success", () => {
        const action = { type: registerClient.pending.type };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.successMessage).toBeNull();
    });

    it("registerClient.fulfilled — sets user, token, isAuthenticated, successMessage", () => {
        const action = {
            type: registerClient.fulfilled.type,
            payload: { user: { id: 2, name: "Sofia", role: "Client" }, token: "token456" },
        };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user.role).toBe("Client");
        expect(state.successMessage).toBe("Account created successfully!");
    });

    it("registerClient.rejected — sets error", () => {
        const action = { type: registerClient.rejected.type, payload: "Email already taken" };
        const state = authReducer(initialState, action);
        expect(state.loading).toBe(false);
        expect(state.error).toBe("Email already taken");
    });
});

describe("authSlice — registerFarmer thunk", () => {
    it("registerFarmer.fulfilled — sets correct successMessage", () => {
        const action = {
            type: registerFarmer.fulfilled.type,
            payload: { user: { id: 3, name: "Hassan", role: "Farmer" }, token: "token789" },
        };
        const state = authReducer(initialState, action);
        expect(state.successMessage).toBe("Farmer account created! Awaiting approval.");
        expect(state.user.role).toBe("Farmer");
    });

    it("registerFarmer.rejected — sets error", () => {
        const action = { type: registerFarmer.rejected.type, payload: "Registration error" };
        const state = authReducer(initialState, action);
        expect(state.error).toBe("Registration error");
    });
});

describe("authSlice — logoutUser thunk", () => {
    it("logoutUser.fulfilled — clears all auth state", () => {
        const loggedInState = {
            ...initialState,
            user: { id: 1, name: "Ahmed" },
            token: "abc",
            isAuthenticated: true,
        };
        const state = authReducer(loggedInState, { type: logoutUser.fulfilled.type });
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it("logoutUser.rejected — still clears local state (graceful logout)", () => {
        const loggedInState = {
            ...initialState,
            user: { id: 1 },
            token: "abc",
            isAuthenticated: true,
        };
        const state = authReducer(loggedInState, { type: logoutUser.rejected.type });
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });
});
