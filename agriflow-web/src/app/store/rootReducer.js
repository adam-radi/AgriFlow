import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import productReducer from "../../features/products/productSlice";
import harvestReducer from "../../features/harvests/harvestSlice";
import orderReducer from "../../features/orders/orderSlice";
import deliveryReducer from "../../features/delivery/deliverySlice";
import adminReducer from "../store/slices/admin/adminSlice";

const rootReducer = combineReducers({
   auth: authReducer,
   products: productReducer,
   harvests: harvestReducer,
   orders: orderReducer,
   delivery: deliveryReducer,
   admin: adminReducer,
})

export default rootReducer;