import {
  findAll,
  findByID,
  findByUserName,
  updateUser,
} from "../../db/userQueries.js";
import User from "../../models/User.model.js";

//view profile
export const viewProfile = async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await findByID(userID);
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const loggedInUserID = req.user.userID;
    const loggedInUser = await findByID(loggedInUserID);

    // Check if either has blocked the other
    if (
      loggedInUser.blockedUsers
        .map((id) => id.toString())
        .includes(userID.toString()) ||
      user.blockedUsers
        .map((id) => id.toString())
        .includes(loggedInUserID.toString())
    ) {
      return res.status(409).json({ message: "User is Blocked" });
    }

    const data = {
      _id: user._id,
      skills: user.skills,
      profile: {
        firstName: user.profile.firstName,
        middleName: user.profile.middleName,
        lastName: user.profile.lastName,
        userName: user.profile.userName,
        dob: user.profile.dob,
        profilePic: user.profile.profilePic,
        about: user.profile.about,
        gender: user.profile.gender,
        location: user.profile.location
      },
    };

    return res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while fetching User Data", error: err.message });
  }
};

//edit profile
export const editProfile = async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "middleName",
      "userName",
      "about",
      "location",
      "canTeach",
      "wantToLearn",
    ];

    const profileUpdates = [
      "firstName",
      "lastName",
      "middleName",
      "userName",
      "profilePic",
      "about",
      "location",
    ];
    const updateKeys = Object.keys(req.body);
    const isValidUpdate = updateKeys.every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid Updates!" });
    }

    const { userID } = req.user;
    const {
      firstName,
      lastName,
      middleName,
      userName,
      about,
      location,
      canTeach,
      wantToLearn,
    } = req.body;

    const existingUser = await findByID(userID);
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    if (userName && userName !== existingUser.profile.userName) {
      const userWithSameName = await findByUserName(userName);
      if (userWithSameName) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    if (
      (canTeach && canTeach.length > 10) ||
      (wantToLearn && wantToLearn.length > 10)
    ) {
      return res
        .status(400)
        .json({ message: "You can add a maximum of 10 skills" });
    }

    const newData = {};
    const profileData = {};
    const skillsData = {};

    for (const key of updateKeys) {
      const value = req.body[key];
      if (value === null || value === undefined) continue;

      const trimmedValue = typeof value === "string" ? value.trim() : value;

      if (profileUpdates.includes(key)) {
        newData[`profile.${key}`] = trimmedValue;
      } else if (["canTeach", "wantToLearn"].includes(key)) {
        newData[`skills.${key}`] = trimmedValue;
      }
    }

    if (Object.keys(profileData).length > 0) newData["profile"] = profileData;
    if (Object.keys(skillsData).length > 0) newData["skills"] = skillsData;

    const updatedUser = await User.findByIdAndUpdate(userID, newData, {
      new: true,
      runValidators: true,
    });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", data: updatedUser });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while updating profile", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const loggedInUser = await User.findById(req.user.userID)
      .select("connections blockedUsers")
      .populate({
        path: "connections.sent",
        select: "receiver", // assuming receiver is a field in ConnectionRequest
      });

    const sentReq = loggedInUser.connections.sent.map((req) =>
      req.receiver?.toString()
    );

    const excludedUserIDs = [
      ...loggedInUser.connections.current,
      req.user.userID,
      ...loggedInUser.blockedUsers,
      ...sentReq,
    ];

    const users = await User.find({
      _id: { $nin: excludedUserIDs },
    })
      .select(
        "profile.firstName profile.middleName profile.lastName profile.userName profile.profilePic profile.about dob gender skills"
      )
      .skip(skip)
      .limit(limit);

    if (!users.length) {
      return res.status(404).json({ message: "No users found!" });
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while fetching the users", error: err.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const { userID } = req.user;

    const userConnections = await User.findById(userID).populate({
      path: "connections.current",
      select:
        "profile.firstName profile.middleName profile.lastName profile.userName profile.profilePic profile.about skills",
    });

    if (!userConnections) {
      return res.status(404).json({ message: "User connections not found" });
    }

    return res.status(200).json({
      message: "Connections fetched successfully",
      data: userConnections.connections.current,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error while loading connections",
      error: err.message,
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const userID = req.user.userID;
    const targetUserID = req.params.userID;

    if (userID.toString() === targetUserID.toString()) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    const user = await findByID(userID);
    const targetUser = await findByID(targetUserID);

    if (!user || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isConnected =
      user.connections.current.includes(targetUserID) &&
      targetUser.connections.current.includes(userID);

    if (!isConnected) {
      return res.status(400).json({ message: "You are not connected with this user" });
    }

    // 👇 clean Mongoose way
    user.connections.current.pull(targetUserID);
    targetUser.connections.current.pull(userID);

    await user.save();
    await targetUser.save();

    return res.status(200).json({ message: "Connection removed successfully" });
  } catch (err) {
    return res.status(500).json({
      message: "Error while removing connection",
      error: err.message,
    });
  }
};
