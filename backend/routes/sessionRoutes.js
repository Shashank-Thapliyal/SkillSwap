
import express from "express"
import authorize from "../middlewares/authorize.js";
import {getUpcomingSessions, getCompletedSessions, getSessionDetails, getSessionsWith} from "../controllers/sessions/getSessionController.js"
import {createNewSession, rescheduleSession, cancelSession} from "../controllers/sessions/sessionActions.js";

const router = express.Router();

router.post("/create", authorize, createNewSession);

router.get("/all", authorize, getUpcomingSessions);
router.get("/completed", authorize, getCompletedSessions);
router.get("/details/:sessionId", authorize, getSessionDetails);
router.get("/:userId", authorize, getSessionsWith);

router.patch("/reschedule/:sessionId", authorize, rescheduleSession);
router.patch("/cancel/:sessionId", authorize, cancelSession);

export default router;
