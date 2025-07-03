import express from "express";
import authorize from "../middlewares/authorize.js";
import { getConversations, sendMessage,  } from "../controllers/conversations/conversationController.js";

const router  = express.Router();

router.post("/", authorize, sendMessage);

router.get("/", authorize, getConversations);

export default router;