import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { CustomerProduct } from "../pages/customerProductData";

// Define the async thunk for saving a product to localhost API
export const saveCustomerProduct = createAsyncThunk(
  "customerProducts/saveProduct",
  async (product: Omit<CustomerProduct, "key">, { rejectWithValue }) => {
    try {
      // Replace this URL with your actual localhost API endpoint if different
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to save product on server");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

interface CustomerProductState {
  saving: boolean;
  error: string | null;
}

const initialState: CustomerProductState = {
  saving: false,
  error: null,
};

const customerProductSlice = createSlice({
  name: "customerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveCustomerProduct.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveCustomerProduct.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(saveCustomerProduct.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export default customerProductSlice.reducer;
