import mongoose from "mongoose";
import Session from "../models/Session.model.js";

export const createSession = async (learner, teacher, time, status, link) => {
  try {
    const sessionId = new mongoose.Types.ObjectId();

    const videoCallLink = link || `https://meet.jit.si/skillswap/session-${sessionId}`;

    const newSession = new Session({
      _id: sessionId,
      learner: learner,
      teacher: teacher,
      callLink: videoCallLink,
      scheduledAt: time,
      status: status,
    });

    await newSession.save();

    return newSession;
  } catch (error) {
    return {
      message: "Error while creating Session",
      error: error.message,
    };
  }
};
