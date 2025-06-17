
import express from "express"
import authorize from "../middlewares/authorize.js";


const router = express.Router();

router.post("/create", authorize, createNewSession);

router.get("/upcoming", authorize, getUpcomingSessions);
router.get("/completed", authorize, getCompletedSessions);
router.get("/details/:sessionId", authorize, getSessionDetails);

router.patch("/reschedule/:sessionId", authorize, rescheduleSession);
router.patch("/cancel/:sessionId", authorize, cancelSession);
