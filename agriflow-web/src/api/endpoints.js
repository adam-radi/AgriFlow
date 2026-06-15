
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
    ORDER_DETAILS: (id) => `/orders/${id}`,
    ORDER_CREATE: "/orders",
    FARMER_ORDERS: "/farmer/orders",
    ADMIN_ORDERS: "/admin/orders",
    DELIVERY: {
        BASE: "/deliveries",
        CREATE: "/deliveries",
        GET_ONE: (id) => `/deliveries/${id}`,
        ASSIGN_ORDERS: (id) => `/deliveries/${id}/assign`,
        UPDATE_STATUS: (id) => `/deliveries/${id}/status`,
        ROUTE: (id) => `/deliveries/${id}/route`,
    },
    PAYMENTS: "/payments",
    ADMIN: "/admin",
};

export default ENDPOINTS;
