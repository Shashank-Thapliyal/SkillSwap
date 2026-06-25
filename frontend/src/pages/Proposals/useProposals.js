import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getSentProposals,
  cancelProposalRequest,
} from "../../api/proposalApi.js";

const useProposals = ({ receiverId } = {}) => {
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const fetchSentProposals = useCallback(async () => {
    if (!receiverId) return;

    try {
      setLoadingProposals(true);
      const response = await getSentProposals(receiverId);
 
      if (response.status === 200) {
        const sorted = [...response.data.proposals].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProposals(sorted);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch proposals");
    } finally {
      setLoadingProposals(false);
    }
  }, [receiverId]);

  const cancelProposal = async (proposalId) => {
    try {
      const response = await cancelProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal cancelled");
        fetchSentProposals();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel proposal");
    }
  };

  return {
    proposals,
    loadingProposals,
    fetchSentProposals,
    cancelProposal,
  };
};

export default useProposals;
