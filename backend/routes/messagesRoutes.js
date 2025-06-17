import express from "express";
import authorize from "../middlewares/authorize";

const router = express.Router();

router.get("/messages/:conversationID", authorize, getMessages);
router.post("/messages/send/:conversationID", authorize, sendMessage );
