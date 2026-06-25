import { useState } from "react";
import ProposalCard from "../Proposals/ProposalCard.jsx";
import Loader from "../../components/Loader.jsx"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal.jsx";
import {
  acceptProposalRequest,
  cancelProposalRequest,
  declineProposalRequest,
} from "../../api/proposalApi.js";

const formatSlot = (slot) => new Date(slot).toLocaleString();

const getUserId = (user) => (typeof user === "string" ? user : user?._id);

const ProposalsTab = ({ proposals, userId, currentUserId, isLoading, onProposalUpdated }) => {

  const navigate = useNavigate();
  const [proposalToAccept, setProposalToAccept] = useState(null);

  const sortedProposals = Array.isArray(proposals)
    ? [...proposals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const refreshProposals = () => {
    if (typeof onProposalUpdated === "function") {
      onProposalUpdated();
    }
  };

  const handleCancelProposalClick = async (proposalId) => {
    try {
      const response = await cancelProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal cancelled");
        refreshProposals();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel proposal");
    }
  };

  const handleAcceptProposal = async (selectedSlot) => {
    if (!proposalToAccept) return;

    if (!selectedSlot) {
      toast.error("Invalid Time Slot");
      return;
    }

    try {
      console.log(selectedSlot)
      const response = await acceptProposalRequest(proposalToAccept._id, selectedSlot);

      if (response.status === 201) {
        toast.success("Proposal accepted & session created");
        setProposalToAccept(null);
        refreshProposals();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept proposal");
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      const response = await declineProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal rejected");
        refreshProposals();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject proposal");
    }
  };

  const acceptedSlot = proposalToAccept?.proposedTimeSlots?.[0];

  return (isLoading ?
    <Loader /> : (
      <div className="flex-1 overflow-y-auto p-4">
        <button className="w-full bg-[#00C3FF] text-black py-2 rounded-lg hover:bg-[#00B2F0] transition-colors" onClick={() => navigate(`/send-proposal/${userId}`)}>
          + Send New Proposal
        </button>
        <div className="flex justify-between">
          <h3 className="text-white text-lg font-semibold my-4">Proposals History</h3>
          <button className=" text-[#00C3FF] mr-4 hover:underline hover:cursor-pointer" onClick={() => navigate("/proposals")}>Manage Proposals</button>
        </div>
        {proposals.length === 0 ? (
          <div className="text-center text-[#A0A0B0] mt-8">
            <p>No proposals yet</p>
            <p className="text-sm mt-2">Start a conversation to send a proposal</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-247px)] overflow-y-auto">
            {sortedProposals.map((proposal) => {
              const isReceiver = getUserId(proposal?.receiver) === currentUserId;
              const isSender = getUserId(proposal?.sender) === currentUserId;

              return (
                <ProposalCard
                  key={proposal?._id}
                  proposal={proposal}
                  direction={isReceiver ? "received" : "sent"}
                  onCancel={isSender ? () => handleCancelProposalClick(proposal?._id) : undefined}
                  onAccept={isReceiver ? () => setProposalToAccept(proposal) : undefined}
                  onReject={isReceiver ? () => handleRejectProposal(proposal?._id) : undefined}
                />
              );
            })}
          </div>
        )}
        <ConfirmationModal
          isOpen={Boolean(proposalToAccept)}
          title="Accept Proposal"
          message="Please select an agreed upon time for this peer-to-peer session."
          slots={proposalToAccept?.proposedTimeSlots}
          onConfirm={handleAcceptProposal}
          onCancel={() => setProposalToAccept(null)}
        />
      </div>)
  );
}
export default ProposalsTab;
