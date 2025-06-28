import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice.js"
import uiReducer from './uiSlice.js';


export const Appstore = configureStore({
  reducer: {
    user : userReducer,
    ui : uiReducer,    
  },
})

