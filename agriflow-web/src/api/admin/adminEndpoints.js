const ADMIN_ENDPOINTS = {
    base: "/admin",
    users: "/admin/users",
    farmers: "/admin/users",
    products: "/admin/products",
    orders: "/admin/orders",
    harvests: "/admin/harvests",
    stats: "/admin/stats",
    validateFarmer: (id) => `/admin/farmers/${id}/approve`,
    rejectFarmer: (id) => `/admin/farmers/${id}/reject`,
    suspendUser: (id) => `/admin/users/${id}`,
    disableProduct: (id) => `/admin/products/${id}/disable`,
    enableProduct: (id) => `/admin/products/${id}/enable`,
    updateProduct: (id) => `/admin/products/${id}`,
    deleteProduct: (id) => `/admin/products/${id}`,
    updateOrderStatus: (id, status) => `/orders/${id}/status/${status}`,
    createDeliveryUser: "/admin/users/delivery",
};

export default ADMIN_ENDPOINTS;
