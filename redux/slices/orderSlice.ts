import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	orders: [],
	isLoading: false,
	error: null,
};

const orderSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {
		// Add reducers here
	},
});

export default orderSlice.reducer;