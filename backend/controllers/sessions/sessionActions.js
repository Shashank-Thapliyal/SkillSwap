import Session from "../../models/Session.model.js";
import User from "../../models/User.model.js";
import { createSession } from "../../utils/createSession.js";

export const createNewSession = async (req, res) => {
  try {
    const { learner, teacher, callLink, scheduledAt, status } = req.body;

    if (!learner || !teacher || !scheduledAt)
      return res
        .status(400)
        .json({ message: "Insufficient Data for creating the session." });
    
    const newDate = new Date(scheduledAt);
    
    if(new Date() > newDate)
        return res.status(400).json({message : "Invalid Date"});

    const isConnected = await User.findOne({
        _id : teacher,
        "connections.current" : learner
    });

    if(!isConnected)
        return res.status(403).json({message : "cannot create session with Unknon Connections"});

    const newSession = await createSession(
      learner,
      teacher,
      callLink,
      scheduledAt,
      status
    );

    return res
      .status(201)
      .json({ message: "Session created Successfully", data: newSession });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error while creating new session",
        error: error.message,
      });
  }
};


export const rescheduleSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { newDate } = req.body;

    if (!sessionId || !newDate) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const newScheduledDate = new Date(newDate);
    if (newScheduledDate < session.scheduledAt) {
      return res
        .status(400)
        .json({ message: "New date must be after the current scheduled date" });
    }

    session.scheduledAt = newScheduledDate;
    await session.save();

    return res.status(200).json({
      message: "Session Rescheduled Successfully",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating Session",
      error: error.message,
    });
  }
};

export const cancelSession = async (req, res) => {
    try {
        const {sessionId} = req.params;
        
        if(!sessionId)
            return res.status(400).json({message : "Invalid Session Id"});
        
        const session = await Session.findById(sessionId);
        
        if(!session)
            return res.status(404).json({message : "Session Not Found"});
        
        if( session.status === "completed" || session.status === "cancelled")
            return res.status(400).json({message : `cannnot cancel ${session.status} session`});

        session.status = "cancelled";
        await session.save();

        return res.status(200).json({message : "Session Cancelled Successfully", data : session});
    } catch (error) {
        return res.status(500).json({message: "Error while cancelling the session", error : error.message});
    }
}