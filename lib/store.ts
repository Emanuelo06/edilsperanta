import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import cartReducer from '../redux/slices/cartSlice';
import productReducer from '../redux/slices/productSlice';
import orderReducer from '../redux/slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
