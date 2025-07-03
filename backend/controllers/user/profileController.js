import {
  findAll,
  findByID,
  findByUserName,
  updateUser,
} from "../../db/userQueries.js";
import { sanitizeData } from "../../middlewares/userDataSanitizer.js";
import User from "../../models/User.model.js";
import Skill from "../../models/Skill.model.js";

//view profile
export const viewProfile = async (req, res) => {
  try {
    const userID = req.params.userID;

    const user = await findByID(userID)
      .populate("skills.canTeach")
      .populate("skills.wantToLearn");

    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const loggedInUserID = req.user.userID;
    const loggedInUser = await findByID(loggedInUserID);

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
        location: user.profile.location,
      },
    };

    return res.status(200).json({ data });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error while fetching User Data",
        error: error.message,
      });
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
        const skillNames = Array.isArray(trimmedValue) ? trimmedValue : [];
        const skillIds = [];

        for (const skillData of skillNames.slice(0, 10)) {
          let name = "";
          let category = "others";

          if (typeof skillData === "string") {
            name = skillData.trim().toLowerCase();
          } else if (typeof skillData === "object") {
            name = (skillData.name || "").trim().toLowerCase();
            category = (skillData.category || "others").trim().toLowerCase();
          }

          if (!name) continue;

          let skill = await Skill.findOne({ name });

          if (!skill) {
            // Create new skill with the provided category
            skill = await Skill.create({ name, category });
          } else {
            // Update existing skill's category if it's different
            if (skill.category !== category) {
              skill = await Skill.findByIdAndUpdate(
                skill._id,
                { category },
                { new: true }
              );
            }
          }

          skillIds.push(skill._id);
        }

        newData[`skills.${key}`] = skillIds;
      }
    }

    if (Object.keys(profileData).length > 0) newData["profile"] = profileData;
    if (Object.keys(skillsData).length > 0) newData["skills"] = skillsData;

    const updatedUser = await User.findByIdAndUpdate(userID, newData, {
      new: true,
      runValidators: true,
    })
      .populate("skills.canTeach")
      .populate("skills.wantToLearn");

    const data = sanitizeData(updatedUser);
    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: data });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while updating profile", error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let limit = Math.min(parseInt(req.query.limit) || 10);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const loggedInUser = await User.findById(req.user.userID)
      .select("connections blockedUsers")
      .populate([
        {
          path: "connections.sent",
          select: "receiverID",
        },
        {
          path: "connections.received",
          select: "senderID",
        },
      ]);

    const sentReq = loggedInUser.connections.sent.map((req) => req.receiverID);

    const receivedReq = loggedInUser.connections.received.map(
      (req) => req.senderID
    );

    const blockedMe = await User.find({
      blockedUsers: req.user.userID,
    }).select("_id");

    const blockedMeIDs = blockedMe.map((user) => user._id.toString());

    const excludedUserIDs = [
      ...loggedInUser.connections.current,
      req.user.userID,
      ...loggedInUser.blockedUsers,
      ...sentReq,
      ...receivedReq,
      ...blockedMeIDs
    ];

    const users = await User.find({
      _id: { $nin: excludedUserIDs },
    })
      .select(
        "profile.firstName profile.middleName profile.lastName profile.userName profile.profilePic profile.about dob gender skills"
      )
      .populate("skills.canTeach")
      .populate("skills.wantToLearn")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while fetching the users", error: err.message });
  }
};

export const getAllSkills = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const search = req.query.search?.toLowerCase().trim() || "";

    const filter = search ? { name: { $regex: search, $options: "i" } } : {};

    const skills = await Skill.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    if (!skills.length) {
      return res.status(404).json({ message: "No skills found" });
    }

    const skillsWithCounts = await Promise.all(
      skills.map(async (skill) => {
        const [teachingCount, learningCount] = await Promise.all([
          User.countDocuments({ "skills.canTeach": skill._id }),
          User.countDocuments({ "skills.wantToLearn": skill._id }),
        ]);

        return {
          _id: skill._id,
          name: skill.name,
          category: skill.category,
          teachingCount,
          learningCount,
        };
      })
    );

    return res.status(200).json({ skills: skillsWithCounts });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error while fetching skills", error: err.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    const { userID } = req.user;

    const userConnections = await User.findById(userID).populate({
      path: "connections.current",
      select:
        "profile.firstName profile.middleName profile.lastName profile.userName profile.profilePic profile.about skills",
      populate: [{ path: "skills.canTeach" }, { path: "skills.wantToLearn" }],
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
      return res
        .status(400)
        .json({ message: "You are not connected with this user" });
    }

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
