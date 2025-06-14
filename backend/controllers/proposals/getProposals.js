import swapProposal from "../../models/SwapProposal.model.js";

export const getSentProposals = async (req, res) => {
  try {
    const requests = await swapProposal
      .find({
        sender: req.user.userID,
      })
      .populate({
        path: "receiver",
        select: "_id profile skills",
      });

    return res
      .status(200)
      .json({ message: "Requests Fetched Successfully", data: requests });

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