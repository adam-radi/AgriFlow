import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import productReducer from "../../features/products/productSlice"; // ✅ correct path

const rootReducer = combineReducers({

   auth:authReducer,
   products: productReducer,

})

export default rootReducer;