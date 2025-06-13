import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    profile: {
      firstName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
      lastName: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            return !value.includes(" ");
          },
          message: ({ value }) =>
            `"${value}" is not a valid username (cannot contain white-spaces)!`,
        },
      },
      dob: {
        type: Date,
        required: true,
        validate(value) {
          if (value > Date.now()) {
            throw new Error("DOB cannot not be a future date");
          }
        },
      },
          gender: {
      type: String,
      set: (val) => val.toLowerCase(),
      enum: ["male", "female", "others"],
      required: true,
    },
      profilePic: {
        type: String,
        validate(value) {
          if (!validator.isURL(value)) {
            throw new Error("Invalid photo URL");
          }
        },
      },
      about: {
        type: String,
        default: "",
      },
      location: {
        type: String,
        default: "",
      },
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
      required: true,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password should be minimum 8 characters long and should contain atleast one uppercase letter, one lowercase letter, one number and one special character"
          );
        }
      },
    },
    skills: {
      canTeach: {
        type: [String],
        default: [],
        validate: [
          (val) => val.length <= 10,
          "Cannot add more than 10 teachable skills",
        ],
      },
      wantToLearn: {
        type: [String],
        default: [],
        validate: [(val) => val.length <= 10, "Cannot add more than 10 skills"],
      },
    },
    connections: {
      current: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      sent: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ConnectionRequest",
        },
      ],
      received: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ConnectionRequest",
        },
      ],
    },
    blockedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
