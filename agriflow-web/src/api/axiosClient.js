import axios from 'axios';

// ─── WHY NO TOP-LEVEL STORE/AUTHSLICE IMPORT ─────────────────────────────────
//
//  axiosClient  ←─── authThunks  ←─── authSlice  ←─── rootReducer  ←─── store
//      │                                                                      │
//      └──────────────────────── store import ───────────────────────────────►│
//
//  Importing the store at the top level creates this cycle and causes:
//  "Cannot access 'loginUser' before initialization"
//
//  Fix: call injectStore() from store.js AFTER the store is created,
//  so the reference is available when interceptors actually run.
//
// ─────────────────────────────────────────────────────────────────────────────

let _store;

/** Called from store.js after createStore() – breaks the circular dep */
export function injectStore(store) {
    _store = store;
}

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

// ─── Request: attach Bearer token ────────────────────────────────────────────
axiosClient.interceptors.request.use(
    (config) => {
        // Prefer Redux store (single source of truth); fall back to localStorage
        const token = _store
            ? _store.getState().auth?.token
            : localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response: handle 401 Unauthorized ───────────────────────────────────────
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Dynamically import authSlice ONLY when a 401 fires (post-init)
            const { logout } = await import('../features/auth/authSlice');
            _store?.dispatch(logout());
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;