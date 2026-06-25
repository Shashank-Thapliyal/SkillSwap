import Session from "../../models/Session.model.js";
import mongoose from "mongoose";

export const getUpcomingSessions = async (req, res) => {
    try {
        const upComingSesions = await Session.find({
            scheduledAt : { $gt : new Date()},
            status : "scheduled",
            $or : [{teacher : req.user.userID}, {learner : req.user.userID}]
        }).lean();

        return res.status(200).json({message : "Upcoming Sessions fetched successfully", data : upComingSesions})
    } catch (error) {
        return res.status(500).json({message : "Error While getting Sessions", error : error.message});
    }
}

export const getCompletedSessions = async (req, res) => {
    try {
        const completedSessions = await Session.find({
            status : "completed",
            $or : [ {teacher : req.user.userID}, {learner : req.user.userID}]
        }).lean();

        return res.status(200).json({message : "Completed Sessions fetched Successfully", data : completedSessions})
    } catch (error) {
        return res.status(500).json({message : "Error while fetching Sessions", error : error.message});
    }
}

export const getSessionDetails = async ( req, res) => {
    try {
        const {sessionId} = req.params;
        if(!sessionId)
            return res.status(400).json({message : "Session Id is Required"});
        
        const sessionDetails = await Session.find({_id : sessionId, 
            $or : [ {teacher : req.user.userID}, {learner : req.user.userID}]
        }).lean();
        
        return res.status(200).json({message : "Session Details fetched Successfully", data : sessionDetails})
    } catch (error) {
        return res.status(500).json({message : "Error while fetching the Session", error : error.message});
    }
}

export const getSessionsWith = async (req, res) => {
    try {
        const { userId } = req.params;
        const loggedInUserId = req.user.userID;

        if (!userId) {
            return res.status(400).json({ message: "User Id is Required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User Id" });
        }

        const sessions = await Session.find({
            $or: [
                { teacher: loggedInUserId, learner: userId },
                { teacher: userId, learner: loggedInUserId },
            ],
        })
            .populate("teacher", "profile.firstName profile.lastName profile.userName profile.profilePic")
            .populate("learner", "profile.firstName profile.lastName profile.userName profile.profilePic")
            .sort({ scheduledAt: 1 })
            .lean();

        return res.status(200).json({
            message: "Sessions fetched Successfully",
            data: sessions,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while fetching Sessions",
            error: error.message,
        });
    }
}

export const getMissedSessions = async (req, res) => {
  try {
    const missedSessions = await Session.find({
      scheduledAt: { $lt: new Date() },
      status: "scheduled",
      $or: [
        { teacher: req.user.userID },
        { learner: req.user.userID },
      ],
    })
      .sort({ scheduledAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Missed Sessions fetched successfully",
      data: missedSessions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching missed sessions",
      error: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { teacher: req.user.userID },
        { learner: req.user.userID },
      ],
    })
      .sort({ scheduledAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Sessions fetched successfully",
      data: sessions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching sessions",
      error: error.message,
    });
  }
};

export const getCancelledSessions = async (req, res) => {
  try {
    const cancelledSessions = await Session.find({
      status: "cancelled",
      $or: [
        { teacher: req.user.userID },
        { learner: req.user.userID },
      ],
    })
      .sort({ scheduledAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Cancelled Sessions fetched successfully",
      data: cancelledSessions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching cancelled sessions",
      error: error.message,
    });
  }
};