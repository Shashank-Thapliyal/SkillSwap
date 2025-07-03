import swapProposal from "../../models/SwapProposal.model.js";

export const getSentProposals = async (req, res) => {
  try {
    const requests = await swapProposal
      .find({
        sender: req.user.userID,
      })
      .populate([{
        path: "receiver",
        select: "profile skills",
        populate : {
          path : "skills.canTeach skills.wantToLearn",
          select : "name category"
        }
      }]);

    return res
      .status(200)
      .json({ message: "Requests Fetched Successfully", proposals: {...requests,
         skills: {
        canTeach: requests?.receiver?.skills?.canTeach?.map(skill => ({
          _id : skill._id,
          name : skill.name,
          category : skill.category
        })) || [],
        wantToLearn: requests?.receiver?.skills?.wantToLearn?.map(skill => ({
          _id : skill._id,
          name : skill.name,
          category : skill.category
        })) || [],
      },
      }});

  } catch (error) {

    return res
      .status(500)
      .json({
        message: "error while fetching sent proposal requests.",
        error: error.message,
      });
  }
};

export const getReceivedProposals = async (req, res) => {
  try {
    const requests = await swapProposal
      .find({
        receiver: req.user.userID,
      })
      .populate({
        path: "sender",
        select: "_id profile skills",
      });

    return res
      .status(200)
      .json({ message: "Requests Fetched Successfully", data: requests });
  } catch (error) {

    return res
      .status(500)
      .json({
        message: "error while fetching  proposal requests.",
        error: error.message,
      });
  }
};

export const getProposalDetails = async (req, res) =>{
    try {
        const {reqId} = req.params;

        if(!reqId)
            return res.status(400).json({message : "Invalid Request Id"});
        const request = await swapProposal.findById(reqId);
        
        if(!request)
            return res.status(404).json({message : "Request Not Found"});

        return res.status(200).json({message : "Request fetched successfully", data : request});
            
    } catch (error) {
        return res.status(500).json({message : "Error while fetching the request data", error : error.message});
    }
}



export const getProposalBetween = async (req, res) => {
  try {
    const loggedInUserId = req.user.userID;
    const { otherUserId } = req.params;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID is required" });
    }

    const proposals = await swapProposal.find({
      $or: [
        { sender: loggedInUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: loggedInUserId }
      ]
    }).populate([
      {
        path: "sender",
        select: "profile skills",
        populate: {
          path: "skills.canTeach skills.wantToLearn",
          select: "name category"
        }
      },
      {
        path: "receiver",
        select: "profile skills",
        populate: {
          path: "skills.canTeach skills.wantToLearn",
          select: "name category"
        }
      }
    ]);

    return res.status(200).json({
      message: "Proposals fetched successfully between both users",
      proposals
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching proposals",
      error: error.message
    });
  }
};
