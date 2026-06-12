import { creatSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
}

const authSlice = creatSlice({
  name :"auth",
  initialState,
  reducers:{}
})
export default authSlice.reducer;