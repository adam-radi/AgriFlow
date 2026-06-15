const ADMIN_ENDPOINTS = {
    base: "/admin",
    users: "/admin/users",
    farmers: "/admin/farmers",
    products: "/admin/products",
    orders: "/admin/orders",
    harvests: "/admin/harvests",
    stats: "/admin/stats",
    validateFarmer: (id) => `/admin/farmers/${id}/validate`,
    rejectFarmer: (id) => `/admin/farmers/${id}/reject`,
    suspendUser: (id) => `/admin/users/${id}/suspend`,
    disableProduct: (id) => `/admin/products/${id}/disable`,
};

export default ADMIN_ENDPOINTS;
