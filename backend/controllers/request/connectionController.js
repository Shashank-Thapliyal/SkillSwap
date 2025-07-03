import { findByID } from "../../db/userQueries.js";
import { deleteConnectionRequest } from "../../middlewares/deleteConnectionRequest.js";
import { sanitizeData } from "../../middlewares/userDataSanitizer.js";
import ConnectionRequest from "../../models/ConnectionRequest.model.js";

//sending a new connection request
export const sendConnectionRequest = async (req, res) => {
  try {
    const senderID = req.user.userID;
    const receiverID = req.params.userID;

    if (senderID.toString() === receiverID.toString()) {
      return res
        .status(404)
        .json({ message: "Sender & Receiver can't be the Same" });
    }

    const receiver = await findByID(receiverID);
    const sender = await findByID(req.user.userID);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver doesn't Exist" });
    }
    // Prevent sending request if already connected

    const alreadyConnected =
      sender.connections.current.includes(receiverID) ||
      receiver.connections.current.includes(senderID);

    if (alreadyConnected) {
      return res
        .status(400)
        .json({ message: "Already connected with this user" });
    }

    const blocked =
      sender.blockedUsers.includes(receiverID) ||
      receiver.blockedUsers.includes(senderID);

    if (blocked) {
      return res
        .status(403)
        .json({ message: "User is blocked, can't send request" });
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { senderID, receiverID },
        { senderID: receiverID, receiverID: senderID },
      ],
    });

    if (
      existingConnectionRequest &&
      existingConnectionRequest.status === "accepted"
    ) {
      return res.status(400).json({ message: "Connection Already Exists" });
    }

    if (
      existingConnectionRequest &&
      existingConnectionRequest.status === "pending"
    ) {
      return res.status(400).json({ message: "Connection req already Exists" });
    }

    if (!existingConnectionRequest) {
      const newConnectionReq = new ConnectionRequest({ senderID, receiverID });
      
      sender.connections.sent.push(newConnectionReq._id);
      receiver.connections.received.push(newConnectionReq._id);
      await newConnectionReq.save();
      await sender.save();
      await receiver.save();
      
      return res
        .status(201)
        .json({
          message: `Connection request sent successfully to ${receiverID}`,
        });
    } else if (
      existingConnectionRequest &&
      existingConnectionRequest.status === "ignored"
    ) {
      existingConnectionRequest.status = "pending";
      
      sender.connections.sent.push(existingConnectionRequest._id);
      receiver.connections.received.push(existingConnectionRequest._id);
      
      await sender.save();
      await receiver.save();
      await existingConnectionRequest.save();

      return res
        .status(200)
        .json({
          message: `Connection request resent successfully to ${receiverID}`,
        });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Error while sending connection request",
      error: err.message,
    });
  }
};

//responding to a recieved connection request
export const respondToConnectionReq = async (req, res) => {
  try {
    const requestID = req.params.requestID;
    const { status } = req.body;
    console.log("requestID", requestID)
    const connectionReq = await ConnectionRequest.findById(requestID);

    if (!connectionReq) {
      return res.status(404).json({ message: "Connection Request Not found" });
    }

    const senderID = connectionReq.senderID;
    const receiverID = connectionReq.receiverID;

    const ALLOWED_STATUS = ["accepted", "ignored", "pending"];
    const isStatusValid = ALLOWED_STATUS.includes(status);

    if (!isStatusValid) {
      return res.status(400).json({ message: "Invalid Status type" });
    }

    const sender = await findByID(senderID);
    const receiver = await findByID(receiverID);

    if (receiverID.toString() !== req.user.userID.toString()) {
      return res
        .status(403)
        .json({ message: "Only the receiver can respond to this request" });

    }

    if (status === "accepted") {
      sender.connections.current.push(receiverID);
      receiver.connections.current.push(senderID);

      await sender.save();
      await receiver.save();
    }

    await deleteConnectionRequest(requestID, res);

    const senderData = sanitizeData(sender);
    const receiverData = sanitizeData(receiver);
    return res.status(200).json({
      message: `Connection Request ${status}`,
      user1: senderData,
      user2: receiverData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "error while responding to request",
        error: err.message,
      });
  }
};

export const withdrawConnectionRequest = async (req, res) => {
  try {
    const senderID = req.user.userID;
    const requestId = req.params.requestID;

    const request = await ConnectionRequest.findById(requestId).populate({
      path : "receiverID",
      select : "profile"
    });
    
    if (!request) {
      return res.status(404).json({ message: "Request doesn't exist" });
    }

    const sender = await findByID(senderID);
    const receiverID = request.receiverID._id;
    const receiver = await findByID(receiverID);
  

    sender.connections.sent.pull(request._id);
    receiver.connections.received.pull(request._id);

    await sender.save();
    await receiver.save();
    await ConnectionRequest.findByIdAndDelete(request._id);

    return res.status(200).json({
      message: `Connection request to ${receiverID} withdrawn successfully`,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error while withdrawing connection request",
      error: error.message,
    });
  }
};
