import User from "../../models/User.model.js";
import { validateData } from "../../utils/validateSignUpData.js";
import { encryptPassword, comparePassword } from "../../utils/encrypting.js";
import { findByEmail, findByUserName } from "../../db/userQueries.js";
import jwt from "jsonwebtoken";
import { sanitizeData } from "../../middlewares/userDataSanitizer.js";

//register user
export const signupUser = async (req, res) => {
  try {
    validateData(req);
    const {
      firstName,
      middleName,
      lastName,
      userName,
      email,
      password,
      dob,
      gender,
    } = req.body;

    const existingUserEmail = await findByEmail(email);
    const existingUserName = await findByUserName(userName);

    if (existingUserEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (existingUserName) {
      return res.status(409).json({ message: "UserName already taken" });
    }

    const hashedPassword = await encryptPassword(password);

    const newUser = new User({
      profile: {
        firstName,
        middleName,
        lastName,
        userName,
        dob,
        gender,
      },
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while Signing Up", error: err.message });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use external function
    const existingUser = await findByEmail(email);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordCorrect = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const payload = {
      userID: existingUser._id,
      email: existingUser.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token);

    const data = sanitizeData(existingUser);
    res.status(200).json({ user: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login Error", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const loggedinUser = req.user;

    if (loggedinUser) {
      res.clearCookie("token");
      return res.status(200).json({ message: "User logged out successfully" });
    }

    return res.status(401).json({ message: "User not logged in" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error while loggin out the user", error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.userID;

    const user = await User.findById(userId)
    .select("-password")
    .populate([
      {
        path: "skills.canTeach",
        select: "name category"
      },
      {
        path: "skills.wantToLearn",
        select: "name category"
      },
      {
        path: "connections.current",
        select: "profile skills",
        populate: [
          {
            path: "skills.canTeach skills.wantToLearn",
            select: "name category"
          }
        ]
      },
      {
        path: "connections.sent",
        populate: {
          path: "receiverID",
          select: "profile skills",
          populate: [
            {
              path: "skills.canTeach skills.wantToLearn",
              select: "name category"
            }
          ]
        }
      },{
        path: "connections.received",
        populate: {
          path: "senderID",
          select: "profile skills",
          populate: [
            {
              path: "skills.canTeach skills.wantToLearn",
              select: "name category"
            }
          ]
        }
      }
    ])
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        userName: user.profile.userName,
        gender: user.profile.gender,
        profilePic: user.profile.profilePic,
        about: user.profile.about,
        location: user.profile.location,
        dob: user.profile.dob,
      },
      skills: {
        canTeach: user?.skills?.canTeach?.map(skill => ({
          _id : skill._id,
          name : skill.name,
          category : skill.category
        })) || [],
        wantToLearn: user?.skills?.wantToLearn?.map(skill => ({
          _id : skill._id,
          name : skill.name,
          category : skill.category
        })) || [],
      },
      connections: {
        current: user.connections.current.map(conn => ({
          _id: conn._id,
          profile: conn.profile,
          skills: {
            canTeach: conn.skills?.canTeach?.map(skill => ({
              _id : skill?._id,
              name : skill?.name,
              category : skill?.category,
            })) || [],
            wantToLearn: conn.skills?.wantToLearn?.map(skill => ({
              _id : skill?._id,
              name : skill?.name,
              category : skill?.category,
            })) || [],
          }
        })),
        sent: user.connections.sent.map(req => ({
          _id: req?._id,
          profile: req?.receiverID?.profile,
          userId : req?.receiverID?._id,
          skills: {
            canTeach: req?.receiverID?.skills?.canTeach?.map(skill => ({
              _id: skill?._id,
              name: skill?.name,
              category: skill?.category,
            })) || [],
            wantToLearn: req?.receiverID?.skills?.wantToLearn?.map(skill => ({
              _id: skill?._id,
              name: skill?.name,
              category: skill?.category,
            })) || [],
          }
        })),
        received: user.connections.received.map(req => ({
          _id: req?._id,
          profile: req?.senderID?.profile,
          userId : req?.senderID?._id,
          skills: {
            canTeach: req?.senderID?.skills?.canTeach?.map(skill => ({
              _id: skill?._id,
              name: skill?.name,
              category: skill?.category,
            })) || [],
            wantToLearn: req?.senderID?.skills?.wantToLearn?.map(skill => ({
              _id: skill?._id,
              name: skill?.name,
              category: skill?.category,
            })) || [],
          }
        })),
      },
      connectionsCount: user.connections.current.length,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while fetching user data",
      error: error.message,
    });
  }
};