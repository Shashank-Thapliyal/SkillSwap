import mongoose from "mongoose";
import validator from "validator";

const sessionSchema = new mongoose.Schema({
  // Directly reference teacher and learner
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  scheduledAt: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["scheduled", "completed", "cancelled"],
    default: "scheduled",
  },
  
  callLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Please provide a valid URL",
    },
  },
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
