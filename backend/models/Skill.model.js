import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "technology",
        "music",
        "education",
        "sports",
        "art",
        "language",
        "lifestyle",
        "others",
      ],
      default: "others",
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
