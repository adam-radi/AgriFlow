// productApi.js — Single source of truth for all product-related HTTP calls.
// Uses the shared axiosClient (JWT already attached via interceptor).

import axiosClient from "../../api/axiosClient";
import ENDPOINTS from "../../api/endpoints";

export const productAPI = {

    /** GET /products  — public catalog (supports ?page= &search= &category=) */
    getAll: (params = {}) =>
        axiosClient.get(ENDPOINTS.PRODUCTS, { params }),

    /** GET /products/:id  — single product detail */
    getById: (id) =>
        axiosClient.get(`${ENDPOINTS.PRODUCTS}/${id}`),

    /** GET /products?farmer_id=me  — authenticated farmer's own products */
    getFarmerProducts: () =>
        axiosClient.get(`${ENDPOINTS.PRODUCTS}/farmer/my-products`),

    /** POST /products  — create (Farmer only, multipart/form-data for image) */
    create: (formData) =>
        axiosClient.post(ENDPOINTS.PRODUCTS, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    /** PUT /products/:id  — update (Farmer only) */
    update: (id, formData) =>
        axiosClient.put(`${ENDPOINTS.PRODUCTS}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    /** DELETE /products/:id  — delete (Farmer only) */
    delete: (id) =>
        axiosClient.delete(`${ENDPOINTS.PRODUCTS}/${id}`),
};
