import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice.js"
import uiReducer from './uiSlice.js';
import SocketReducer from './socketSlice.js';

export const Appstore = configureStore({
  reducer: {
    user : userReducer,
    ui : uiReducer,    
    socket : SocketReducer
  },
})

