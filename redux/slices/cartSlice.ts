import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	imageUrl: string;
}

interface CartState {
	items: CartItem[];
	subtotal: number;
	tax: number;
	shipping: number;
	total: number;
	isLoading: boolean;
	lastSynced: string | null;
}

const initialState: CartState = {
	items: [],
	subtotal: 0,
	tax: 0,
	shipping: 0,
	total: 0,
	isLoading: false,
	lastSynced: null,
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) => {
			const { id, name, price, imageUrl, quantity = 1 } = action.payload;
			const existingItem = state.items.find(item => item.id === id);
			
			if (existingItem) {
				existingItem.quantity += quantity;
			} else {
				state.items.push({ id, name, price, imageUrl, quantity });
			}
			
			// Recalculate totals
			state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
			state.tax = state.subtotal * 0.19; // 19% VAT
			state.shipping = state.subtotal > 200 ? 0 : 20; // Free shipping over 200 RON
			state.total = state.subtotal + state.tax + state.shipping;
		},
		
		removeFromCart: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(item => item.id !== action.payload);
			
			// Recalculate totals
			state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
			state.tax = state.subtotal * 0.19;
			state.shipping = state.subtotal > 200 ? 0 : 20;
			state.total = state.subtotal + state.tax + state.shipping;
		},
		
		updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
			const { id, quantity } = action.payload;
			const item = state.items.find(item => item.id === id);
			
			if (item) {
				if (quantity <= 0) {
					state.items = state.items.filter(item => item.id !== id);
				} else {
					item.quantity = quantity;
				}
			}
			
			// Recalculate totals
			state.subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
			state.tax = state.subtotal * 0.19;
			state.shipping = state.subtotal > 200 ? 0 : 20;
			state.total = state.subtotal + state.tax + state.shipping;
		},
		
		clearCart: (state) => {
			state.items = [];
			state.subtotal = 0;
			state.tax = 0;
			state.shipping = 0;
			state.total = 0;
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;