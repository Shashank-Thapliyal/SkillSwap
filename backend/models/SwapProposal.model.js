import mongoose, { Schema } from "mongoose";

const swapProposalSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined",  "cancelled"],
    default: "pending",
  },
  proposedTimeSlots: {
    type: [Date],
    validate: [
      (arr) => arr.length > 0,
      "At least one time slot must be provided",
    ],
  },
  paymentType: {
    type: String,
    enum: ["swap", "paid", "free"],
    default: "free",
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    amount: Number,
    transactionId: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
});

swapProposalSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const swapProposal = mongoose.model("swapProposal", swapProposalSchema);
export default swapProposal;
