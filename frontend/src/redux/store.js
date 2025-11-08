import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./Slices/customerSlice";
import basketReducer from "./Slices/SendToBasket";
import userReducer from "./Slices/userSlice";

const store = configureStore({
  reducer: {
    customer: customerReducer,
    basket: basketReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
export default store;
