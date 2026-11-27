import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import productReducer from "../../features/products/productSlice";
import harvestReducer from "../../features/harvests/harvestSlice";
import orderReducer from "../../features/orders/orderSlice";
import cartReducer from "../../features/orders/cartSlice";
import deliveryReducer from "../../features/delivery/deliverySlice";
import adminReducer from "../store/slices/admin/adminSlice";
import profileReducer from "../../features/profile/profileSlice";
import verificationReducer from "../../features/verification/verificationSlice";
import inquiryReducer from "../../features/inquiries/inquirySlice";
import notificationReducer from "../../features/notifications/notificationSlice";

const rootReducer = combineReducers({
   auth: authReducer,
   products: productReducer,
   harvests: harvestReducer,
   orders: orderReducer,
   cart: cartReducer,
   delivery: deliveryReducer,
   admin: adminReducer,
   profile: profileReducer,
   verification: verificationReducer,
   inquiries: inquiryReducer,
   notifications: notificationReducer,
})

export default rootReducer;