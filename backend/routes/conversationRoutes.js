import express from "express";
import authorize from "../middlewares/authorize";


const router  = express.Router();

router.post("/conversations", authorize, sendMessage);
router.get("/conversations/:userID", authorize, getConversation);