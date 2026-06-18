import mongoose from "mongoose";
import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.model.js";

async function seedMessages() {
  await mongoose.connect("mongodb+srv://proshashank0:oNHtQAkhqDXViC38@next-app-trail.poxmg.mongodb.net/skillswap");

  const userA = "684c1a09984e09339409ccfa";
  const userB = "684d6824153e4fe50751645a";

  let conversation = await Conversation.findOne({
    participants: { $all: [userA, userB] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userA, userB],
    });
  }

  const messagesToInsert = [
    {
      content: "Hey! Ready for our SkillSwap session?",
      sender: userA,
      receiver: userB,
      conversation: conversation._id,
    },
    {
      content: "Yes! Let’s start at 5 PM.",
      sender: userB,
      receiver: userA,
      conversation: conversation._id,
    },
  ];

  const inserted = await Message.insertMany(messagesToInsert);

  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: inserted[inserted.length - 1]._id,
  });

  console.log("✅ Messages inserted");

  await mongoose.disconnect();
}

seedMessages();
