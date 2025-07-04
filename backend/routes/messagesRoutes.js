import express from "express";
import authorize from "../middlewares/authorize.js";
import {getMessages } from "../controllers/conversations/conversationController.js"

const router = express.Router();

//get messages with other user
router.get("/:otherUser", authorize, getMessages);


export default router;