// productApi.js — Single source of truth for all product-related HTTP calls.
// Uses the shared axiosClient (JWT already attached via interceptor).

import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const productAPI = {

    /** GET /public/products  — public catalog (supports ?page=) */
    getAll: (params = {}) =>
        axiosClient.get(ENDPOINTS.PUBLIC_PRODUCTS, { params }),

    /** GET /public/products/:id  — public product detail */
    getById: (id) =>
        axiosClient.get(ENDPOINTS.PUBLIC_PRODUCT_DETAILS(id)),

    /** GET /products  — authenticated farmer's own products (backend filters by auth) */
    getFarmerProducts: () =>
        axiosClient.get(ENDPOINTS.PRODUCTS),

    /** POST /products  — create (Farmer only, multipart/form-data for image) */
    create: (formData) =>
        axiosClient.post(ENDPOINTS.PRODUCTS, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    /** POST /products/:id  — update via _method=PUT (Farmer only) */
    update: (id, formData) => {
        if (formData instanceof FormData && !formData.has("_method")) {
            formData.append("_method", "PUT");
        }
        return axiosClient.post(`${ENDPOINTS.PRODUCTS}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    /** DELETE /products/:id  — delete (Farmer only) */
    delete: (id) =>
        axiosClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`),

    /** POST /products/:id/quantities — update or create single quantity tier */
    manageQuantity: (id, data) =>
        axiosClient.post(`${ENDPOINTS.PRODUCTS}/${id}/quantities`, data),
};
