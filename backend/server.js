import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io"; 
import cookieParser from "cookie-parser";
import connectDb from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  }
});

app.use(cookieParser());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// routes config.
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/proposals", proposalRoutes);


connectDb().then(() => {
  server.listen(process.env.PORT || 5555, () => {
    console.log("Server Running on port:", process.env.PORT || 5555);
  });
}).catch((err) => {
  console.log("Failed to connect to DB", err);
});

export { io, server };
