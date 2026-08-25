import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Interface for product item
export interface ProductItem {
  id: string;
  pallets: number;
  pieces: number;
  packageType: string;
  description: string;
  stackable: boolean;
  hazmat: boolean;
  nmfc: string;
  length: number;
  width: number;
  height: number;
  pcfDensity: number;
  class: string;
  weight: number;
}

// interface for product state
interface ProductState {
  items: ProductItem[];
  weightUnit: "Lbs" | "Kgs";
}

// Initial state for product
const initialState: ProductState = {
  // data from response // Currently Static Data Show
  items: [
    {
      id: "prod_1",
      pallets: 2,
      pieces: 40,
      packageType: "Pallet",
      description: "Electronic Components",
      stackable: true,
      hazmat: false,
      nmfc: "116030",
      length: 48,
      width: 40,
      height: 48,
      pcfDensity: 12.50,
      class: "70",
      weight: 1200,
    },
    {
      id: "prod_2",
      pallets: 1,
      pieces: 10,
      packageType: "Carton",
      description: "Lithium Batteries",
      stackable: false,
      hazmat: true,
      nmfc: "060680",
      length: 24,
      width: 24,
      height: 24,
      pcfDensity: 15.00,
      class: "85",
      weight: 300,
    },
  ],
  weightUnit: "Lbs",
};

// slice for managing product state
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // add product row
    addProductRow: (state) => {
      state.items.push({
        id: Date.now().toString(),
        pallets: 1,
        pieces: 25,
        packageType: "Box",
        description: "Lithium Batteries",
        stackable: true,
        hazmat: false,
        nmfc: "060680",
        length: 20,
        width: 20,
        height: 20,
        pcfDensity: 10.00,
        class: "60",
        weight: 500,
      });
    },
    // remove product row
    removeProductRow: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    // update product row
    updateProductRow: (
      state,
      action: PayloadAction<{ id: string; field: keyof ProductItem; value: any }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        (item as any)[action.payload.field] = action.payload.value;
      }
    },
    // set weight unit
    setWeightUnit: (state, action: PayloadAction<"Lbs" | "Kgs">) => {
      state.weightUnit = action.payload;
    },
  },
});

export const { addProductRow, removeProductRow, updateProductRow, setWeightUnit } = productSlice.actions;
// Export slice reducer
export default productSlice.reducer;
