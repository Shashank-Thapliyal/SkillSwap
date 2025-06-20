import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    logout() {
      return null;
    },
    updateUser(state, action) {
      return { ...state, ...action.payload };
    }
  }
});

export const { setUser, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
