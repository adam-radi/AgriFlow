
const ENDPOINTS = {
    AUTH: {
        LOGIN: "/auth/Login",
        REGISTER: "/auth/register",
        LOGOUT: "/logout",
        ME: "/me",
    },

    PRODUCTS: "/products",

    HARVESTS: "/harvest",
    HARVEST_DETAILS: (id) => `/harvest/${id}`,
    HARVEST_CREATE: "/harvest",
    HARVEST_UPDATE: (id) => `/harvest/${id}`,
    HARVEST_DELETE: (id) => `/harvest/${id}`,
    FARMER_HARVESTS: "/farmers/harvests",
    HARVEST_FORECAST: (id) => `/harvest/${id}/forecast`,
    HARVEST_ORDERS: (id) => `/harvest/${id}/orders`,
    ADMIN_HARVESTS: "/admin/harvests",

    ORDERS: "/orders",
    DELIVERY: "/deliveries",
    PAYMENTS: "/payments",
    ADMIN: "/admin",
};

export default ENDPOINTS;
