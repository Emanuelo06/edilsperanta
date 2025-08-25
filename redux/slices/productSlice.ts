import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	items: [],
	featured: [],
	currentProduct: null,
	categories: [],
	filters: {},
	pagination: {},
	isLoading: false,
	error: null,
};

const productSlice = createSlice({
	name: "products",
	initialState,
	reducers: {
		// Add reducers here
	},
});

export default productSlice.reducer;