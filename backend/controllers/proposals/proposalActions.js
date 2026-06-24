import { findByID } from "../../db/userQueries.js";
import swapProposal from "../../models/SwapProposal.model.js";
import { createSession } from "../../utils/createSession.js";

export const sendProposal = async (req, res) => {
  try {
    const { message, timeSlots, paymentType } = req.body;
    const { receiverId } = req.params;

    if (!message || !paymentType || !receiverId)
      return res.status(400).json({ message: "Invalid proposal Request" });

    if (!Array.isArray(timeSlots) || timeSlots.length === 0)
      return res
        .status(400)
        .json({ message: "Provide at least one time Slot" });

    const senderId = req.user.userID;

    if (senderId.toString() === receiverId.toString())
      return res
        .status(409)
        .json({ message: "Sender & Reciever can't be the same." });

    const receiver = await findByID(receiverId).select("connections.current");
    const sender = await findByID(senderId).select("connections.current");

    if (!receiver)
      return res.status(404).json({ message: "User does not exist" });

    const isConnected =
      receiver.connections.current.some(
        (conn) => conn.toString() === senderId,
      ) &&
      sender.connections.current.some((conn) => conn.toString() === receiverId);

    if (!isConnected) {
      return res
        .status(403)
        .json({ message: "Can't send proposals to Unknown Connections" });
    }

    const newProposalReq = new swapProposal({
      sender: senderId,
      receiver: receiverId,
      message,
      paymentType: paymentType,
      proposedTimeSlots: timeSlots,
    });

    await newProposalReq.save();

    return res.status(201).json({ message: "Proposal sent Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error while sending Proposal", error: error.message });
  }
};

export const respondToProposal = async (req, res) => {
  try {
    const { status, timeSlot } = req.body;
    const { reqId } = req.params;

    if (!status || !reqId || status === "pending") {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    const request = await swapProposal.findById(reqId);

    if (
      !request ||
      request.receiver.toString() !== req.user.userID.toString()
    ) {
      return res.status(404).json({
        message: "Swap Proposal Request Not Found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: `Proposal has already been ${request.status}`,
      });
    }

    if (status === "declined") {
      request.status = "declined";
      await request.save();

      return res.status(200).json({
        message: "Request Declined Successfully",
      });
    }

    if (status === "accepted") {
      if (timeSlot && !request.proposedTimeSlots.includes(timeSlot)) {
        return res.status(400).json({
          message: "Invalid time slot selected",
        });
      }

      request.status = "accepted";
      await request.save();

      const scheduledTime = timeSlot || request.proposedTimeSlots[0];

      const newSession = await createSession(
        request.sender,
        request.receiver,
        scheduledTime,
        "scheduled",
      );

      return res.status(201).json({
        message:
          "Request has been accepted and a new session has been scheduled",
        data: newSession,
      });
    }

    return res.status(400).json({
      message: "Invalid status value",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while responding to proposal",
      error: error.message,
    });
  }
};


export const cancelProposal = async (req, res) => {
  try {
    const { reqId } = req.params;
    if (!reqId) return res.status(400).json({ message: "Invalid Request" });

    const request = await swapProposal.findById(reqId);

    if (!request || request.sender.toString() !== req.user.userID)
      return res.status(404).json({ message: "Request not found" });

    if (request.status && request.status !== "pending")
      return res.status(400).json({ message: "Can't Cancel This Request" });

    request.status = "cancelled";
    await request.save();

    return res.status(200).json({ message: "request cancelled successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error while cancelling the Request",
      error: error.message,
    });
  }
};
