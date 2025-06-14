import mongoose from "mongoose";

const participantSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["teacher", "learner"],
    required: true,
  },
};

const sessionSchema = new mongoose.Schema({
  participants: {
    type: [participantSchema],
    validate: [val => val.length === 2, "Swap must have exactly two participants"],
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  }
},{timestamps : true});

const session = mongoose.model("Session", sessionSchema);
export default session;
