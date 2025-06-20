import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice.js"

export const Appstore = configureStore({
  reducer: {
    user : userReducer
  },
})

