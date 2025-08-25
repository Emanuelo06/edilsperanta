import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
		// Add reducers here
	},
});

export default cartSlice.reducer;