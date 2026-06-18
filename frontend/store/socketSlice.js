// socketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = createAsyncThunk('socket/connect', async (user, { rejectWithValue }) => {
  if (!user?._id) {
    return rejectWithValue("Missing user id");
  }

  if (socket?.connected) {
    return true;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io("http://localhost:5000", {
    withCredentials: true,
  });

  return new Promise((resolve, reject) => {
    socket.once("connect", () => {
      socket.emit("add-user", user._id);
    });

    socket.once("connected", () => {
      resolve(true);
    });

    socket.once("connect_error", (error) => {
      socket?.disconnect();
      socket = null;
      reject(rejectWithValue(error.message));
    });
  });
});

export const disconnectSocket = createAsyncThunk('socket/disconnect', async () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
  return true;
});


const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    isConnected: false,
    status: 'idle', // 'idle' | 'connecting' | 'connected' | 'failed'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectSocket.pending, (state) => {
        state.status = 'connecting';
      })
      .addCase(connectSocket.fulfilled, (state) => {
        state.status = 'connected';
        state.isConnected = true;
      })
      .addCase(connectSocket.rejected, (state) => {
        state.status = 'failed';
        state.isConnected = false;
      })
      .addCase(disconnectSocket.fulfilled, (state) => {
        state.status = 'idle';
        state.isConnected = false;
      });
  },
});

export const getSocket = () => socket;

export default socketSlice.reducer;
