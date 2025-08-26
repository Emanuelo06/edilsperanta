import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { OrderService, Order } from "@/services/orderService";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  stats: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  } | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  stats: null,
};

// Async Thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (filters?: {
    status?: string;
    paymentStatus?: string;
    userId?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    const orders = await OrderService.getOrders(20, filters);
    return orders;
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string) => {
    const order = await OrderService.getOrder(id);
    return order;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string) => {
    const orders = await OrderService.getOrdersByUser(userId);
    return orders;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Omit<Order, 'id' | 'orderNumber'>) => {
    const orderId = await OrderService.createOrder(orderData);
    const order = await OrderService.getOrder(orderId);
    return order;
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (data: { id: string; updates: Partial<Order> }) => {
    await OrderService.updateOrder(data.id, data.updates);
    const order = await OrderService.getOrder(data.id);
    return order;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (data: { id: string; reason?: string }) => {
    await OrderService.cancelOrder(data.id, data.reason);
    const order = await OrderService.getOrder(data.id);
    return order;
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async () => {
    const stats = await OrderService.getOrderStats();
    return stats;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      
      // Fetch Single Order
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch order';
      })
      
      // Fetch User Orders
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.orders.unshift(action.payload);
          state.currentOrder = action.payload;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      
      // Update Order
      .addCase(updateOrder.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.orders.findIndex(order => order.id === action.payload!.id);
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          if (state.currentOrder?.id === action.payload.id) {
            state.currentOrder = action.payload;
          }
        }
      })
      
      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.orders.findIndex(order => order.id === action.payload!.id);
          if (index !== -1) {
            state.orders[index] = action.payload;
          }
          if (state.currentOrder?.id === action.payload.id) {
            state.currentOrder = action.payload;
          }
        }
      })
      
      // Fetch Order Stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setCurrentOrder, clearError, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;