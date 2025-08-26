import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProductService, Product } from "@/services/productService";

interface ProductState {
  items: Product[];
  featured: Product[];
  currentProduct: Product | null;
  categories: string[];
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  };
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  featured: [],
  currentProduct: null,
  categories: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 20,
    hasMore: true,
  },
  isLoading: false,
  error: null,
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters?: { category?: string; status?: string; minPrice?: number; maxPrice?: number }) => {
    const response = await ProductService.getProducts(20, undefined, filters);
    return response.products;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string) => {
    const product = await ProductService.getProduct(id);
    return product;
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    const products = await ProductService.getFeaturedProducts();
    return products;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: { product: Omit<Product, 'id'>; images?: File[] }) => {
    const id = await ProductService.createProduct(data.product, data.images);
    const product = await ProductService.getProduct(id);
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (data: { id: string; updates: Partial<Product>; images?: File[] }) => {
    await ProductService.updateProduct(data.id, data.updates, data.images);
    const product = await ProductService.getProduct(data.id);
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await ProductService.deleteProduct(id);
    return id;
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm: string) => {
    const products = await ProductService.searchProducts(searchTerm);
    return products;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      
      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featured = action.payload;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create product';
      })
      
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.items.findIndex(product => product.id === action.payload!.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.currentProduct?.id === action.payload.id) {
            state.currentProduct = action.payload;
          }
        }
      })
      
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(product => product.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      
      // Search Products
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;