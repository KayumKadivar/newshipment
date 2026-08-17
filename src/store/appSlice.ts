import { createSlice } from "@reduxjs/toolkit";

export type AppState = {
  isAuthenticated: boolean;
};

const initialState: AppState = {
  isAuthenticated: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = appSlice.actions;
export default appSlice.reducer;
