import express from "express"
import authorize from "../middlewares/authorize.js";
import  { getProposalDetails, getReceivedProposals, getSentProposals } from "../controllers/proposals/getProposals.js";
import {sendProposal, cancelProposal, respondToProposal } from "../controllers/proposals/proposalActions.js";
import { updatePaymentStatus } from "../controllers/proposals/updatePayment.js";

const router = express.Router();

router.get("/sent", authorize, getSentProposals);
router.get("/received", authorize, getReceivedProposals);

router.post("/send/:receiverId", authorize, sendProposal);
router.patch("/:reqId", authorize, respondToProposal); //req.body me status dalna hai -> accept decline
router.get("/:reqId", authorize, getProposalDetails);

router.patch("/payment/:reqId",authorize, updatePaymentStatus);
router.delete("/:reqId", authorize, cancelProposal);


export default router;