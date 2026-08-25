import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { LocationAccessorial } from "../pages/customerLocationData";

interface AccessorialsState {
  data: LocationAccessorial[];
  loading: boolean;
  error: string | null;
}

const initialState: AccessorialsState = {
  data: [],
  loading: false,
  error: null,
};

// Simulated API call function
const fetchAccessorialsAPI = async (): Promise<LocationAccessorial[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        "Blind Shipment",
        "Call Before Delivery",
        "Call Before Pickup",
        "Delivery Appointment",
        "Guaranteed By 5PM",
        "Inside Delivery",
        "Inside Pick Up",
        "Liftgate Delivery",
        "Liftgate Pickup",
        "Limited Access Delivery",
        "Limited Access Pickup",
        "Notify Before Delivery",
        "Protect From Freeze",
        "Residential Delivery",
        "Residential Pick Up",
        "Sort and Segregate",
        "Trade Show Delivery",
        "Trade Show Pickup",
        "Hazmat",
        "White Glove Service",
      ]);
    }, 500);
  });
};

export const fetchAccessorials = createAsyncThunk(
  "accessorials/fetchAccessorials",
  async () => {
    const response = await fetchAccessorialsAPI();
    return response;
  }
);

const accessorialsSlice = createSlice({
  name: "accessorials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessorials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccessorials.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAccessorials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch accessorials";
      });
  },
});

export default accessorialsSlice.reducer;
