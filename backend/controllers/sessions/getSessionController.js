import Session from "../../models/Session.model.js";

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

