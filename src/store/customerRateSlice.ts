import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Interface for rate item
export interface RateItem {
  id: string;
  code: string;
  description: string;
  buyAmount: number;
  customerAmount: number;
}

// Interface for customer rate state
interface CustomerRateState {
  rates: RateItem[];
  netFreight: number;
  fuelPercentage: number;
  total: number;
  loading: boolean;
  error: string | null;
}

// Initial state for customer rate
const initialState: CustomerRateState = {
  rates: [],
  netFreight: 0,
  fuelPercentage: 0,
  total: 0,
  loading: false,
  error: null,
};

// Simulated API call function
const fetchRatesAPI = async (): Promise<RateItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // data from response // Currently Static Data Show
      resolve([
        {
          id: "1",
          code: "FRT",
          description: "Base Freight Charge",
          buyAmount: 450.0,
          customerAmount: 500.0,
        },
        {
          id: "2",
          code: "FSC",
          description: "Fuel Surcharge",
          buyAmount: 45.0,
          customerAmount: 50.0,
        },
      ]);
    }, 1000); 
  });
};

// async thunk for fetching rates
export const fetchCarrierRates = createAsyncThunk(
  "customerRate/fetchCarrierRates",
  async () => {
    const response = await fetchRatesAPI();
    return response;
  }
);

// slice for managing rate state
const customerRateSlice = createSlice({
  name: "customerRate",
  initialState,
  reducers: {
    clearRates: (state) => {
      state.rates = [];
      state.netFreight = 0;
      state.fuelPercentage = 0;
      state.total = 0;
    }
  },
  // extraReducers is used to handle extra reducers
  extraReducers: (builder) => {
    builder
      // fetchCarrierRates.pending: when request is started
      .addCase(fetchCarrierRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fetchCarrierRates.fulfilled: when request is successful
      .addCase(fetchCarrierRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
        // Mock totals logic
        state.netFreight = action.payload.reduce((sum, rate) => sum + rate.customerAmount, 0);
        state.fuelPercentage = 10;
        state.total = state.netFreight + (state.netFreight * state.fuelPercentage) / 100;
      })
      // fetchCarrierRates.rejected: when request is failed
      .addCase(fetchCarrierRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch rates";
      });
  },
});

export const { clearRates } = customerRateSlice.actions;
// Export slice reducer
export default customerRateSlice.reducer;
