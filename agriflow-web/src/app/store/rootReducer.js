import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import productReducer from "../../features/products/productSlice";
import harvestReducer from "../../features/harvests/harvestSlice";

const rootReducer = combineReducers({
   auth: authReducer,
   products: productReducer,
   harvests: harvestReducer,
})

export default rootReducer;