import User from "../../models/User.model.js";

export const getSentRequests = async (req, res) => {
  try {
    const userID = req.user.userID;

    const user = await User.findById(userID).populate({
      path: "connections.sent",
      populate: {
        path: "receiverID",
        select:
          "profile.userName profile.firstName profile.middleName profile.lastName profile.profilePic skills gender profile.dob profile.about",
      },
    });

    console.log(user.connections.sent);

    if (!user) {
      return res.status(404).json({ message: "Requests not found" });
    }


    return res
      .status(200)
      .json({ message: "Requests fetched successfully", data: user.connections.sent });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "Error while fetching sent Match requests",
        error: err.message,
      });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userID = req.user.userID;

    const user = await User.findById(userID).populate({
      path: "connections.received",
      match: { status: "pending" },
      populate: {
        path: "senderID",
        select:
          "profile.userName profile.firstName profile.middleName profile.lastName profile.profilePic skills profile.gender profile.dob profile.about profile.location",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Requests not found" });
    }

    return res
      .status(200)
      .json({
        message: "Requests fetched successfully",
        data: user.connections.received,
      });
  } catch (err) {
    return res
      .status(500)
      .json({
        message: "Error while fetching pending requests",
        error: err.message,
      });
  }
};
