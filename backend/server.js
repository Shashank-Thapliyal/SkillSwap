import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import connectDb from "./db/database.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import cors from "cors";

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: '*', 
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 5555;

app.use(express.json());

//routes configuration
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/proposals", proposalRoutes);


connectDb().then(() => {
  app.listen(port, () => {
    console.log("Server Running on port:", port);
  });
}).catch((err)=>{
    console.log("failed to connect to db", err)
});
