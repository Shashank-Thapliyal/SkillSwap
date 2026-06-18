import { toast } from "react-toastify";
import { cancelProposalRequest } from "../api/proposalApi";

const useProposalActions = ({ onSuccess } = {}) => {
  const handleCancelProposal = async (proposalId) => {
    try {
      const response = await cancelProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal cancelled");
        if (typeof onSuccess === "function") {
          await onSuccess();
        }
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel proposal");
      return false;
    }
  };

  return {handleCancelProposal};
};

export default useProposalActions;
