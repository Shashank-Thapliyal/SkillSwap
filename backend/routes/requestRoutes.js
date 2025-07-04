import express from "express";
import authorize from "../middlewares/authorize.js";
import {sendConnectionRequest, respondToConnectionReq, withdrawConnectionRequest} from "../controllers/request/connectionController.js"
import {getSentRequests, getPendingRequests } from "../controllers/request/requestStatusController.js"

const router = express.Router();

router.post("/send/:userID", authorize, sendConnectionRequest);
router.patch("/respond/:requestID", authorize, respondToConnectionReq);

router.get("/sentRequests", authorize, getSentRequests);
router.get("/pendingRequests", authorize, getPendingRequests);

router.delete("/withdraw/:requestID", authorize, withdrawConnectionRequest);
export default router;