import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import cartSlice from "./slices/cartSlice";
import orderSlice from "./slices/orderSlice";
import productSlice from "./slices/productSlice";

export const store = configureStore({
   reducer: {
      auth: authSlice,
      cart: cartSlice,
      orders: orderSlice,
      products: productSlice,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
         },
      }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;