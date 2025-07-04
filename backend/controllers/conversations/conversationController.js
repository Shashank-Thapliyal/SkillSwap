import mongoose, { mongo } from "mongoose";
import Conversation from "../../models/Conversation.model.js";
import Message from "../../models/Message.model.js";
import { users } from "../../utils/socket/socketHandler.js";
import { io } from "../../server.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    if (!receiver || !message)
      return res
        .status(400)
        .json({ message: "Receiver & Message are required" });

    let conversationId;
    const conversation = await Conversation.findOne({
      participants: { $all: [req.user.userID, receiver] },
    });

    const newMessageId = new mongoose.Types.ObjectId();
    if (conversation) {
      conversation.lastMessage = newMessageId;
      conversationId = conversation._id;

      await conversation.save();
    } else {
      const newConversation = new Conversation({
        participants: [req.user.userID, receiver],
        lastMessage: newMessageId,
      });

      conversationId = newConversation._id;
      await newConversation.save();
    }

    const newMessage = new Message({
      _id: newMessageId,
      content: message,
      conversation: conversationId,
      sender: req.user.userID,
      receiver: receiver,
    });

    await newMessage.save();

    const socketId = users.get(receiver);

    if (socketId) {
      io.to(socketId).emit("send-message", {
        content: message,
        sender: req.user.userID,
        conversationId,
        createdAt: new Date(),
      });
    }

    return res.status(201).json({ message: "Message Sent Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while sending message", error: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.userID;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate([{path : "lastMessage" },{path : "participants", select : "profile"}])
      .sort({ updatedAt: -1 })
      .lean();

    const sanitizedConversations = conversations.map( (conv) =>({
      ...conv,
      participants : conv.participants.filter((user)=> user._id.toString() !== userId),
    }))

    return res
      .status(200)
      .json({ message: "Conversations fetched successfully", conversations : sanitizedConversations });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error while fetching conversations",
        error: error.message,
      });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUser } = req.params;
    if (!otherUser)
      return res.status(400).json({ message: "Invalid Fetch Request" });

    const messages = await Message.find({
      $or: [
        { sender: req.user.userID, receiver: otherUser },
        { sender: otherUser, receiver: req.user.userID },
      ],
    })
      .populate(
        "sender",
        "profile.profilePic profile.firstName profile.lastName"
      )
      .populate(
        "receiver",
        "profile.profilePic profile.firstName profile.lastName"
      )
      .lean();

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching Conversations",
      error: error.message,
    });
  }
};
