import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Loader from "../../components/Loader";
import ProposalCard from "./ProposalCard";

import {
  getReceivedProposals,
  acceptProposalRequest,
  declineProposalRequest,
} from "../../api/proposalApi";

const ReceivedProposals = ({hideCancelButton}) => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchReceivedProposals = async () => {
  try {
    setLoading(true);
    const response = await getReceivedProposals();
    if (response.status === 200) {
      const proposalsData = Array.isArray(response.data.proposals)
      ? response.data.proposals
      : [];

      const sorted = [...proposalsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProposals(sorted);
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to fetch proposals");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchReceivedProposals();
  }, []);


  const handleAccept = async (proposal) => {
    try {
      const selectedSlot = proposal.proposedTimeSlots?.[0];
      const response = await acceptProposalRequest(
        proposal._id,
        selectedSlot
      );
      if (response.status === 201) {
        toast.success("Proposal accepted & session created");
        fetchReceivedProposals();
      }
    } catch {
      toast.error("Failed to accept proposal");
    }
  };

  const handleDecline = async (proposalId) => {
    try {
      const response = await declineProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal declined");
        fetchReceivedProposals();
      }
    } catch {
      toast.error("Failed to decline proposal");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-[#1E1E2F] rounded-lg border border-[#3C3C55] shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-6">
        Received Proposals
      </h2>

      {proposals.length === 0 ? (
        <p className="text-white text-center">
          No proposals received yet.
        </p>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal._id}>
              <ProposalCard proposal={proposal} direction="received" hideCancelButton={hideCancelButton} />

              {/* ACTIONS */}
              <div className="flex gap-3 mt-3">
                {proposal.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAccept(proposal)}
                      className="px-4 py-1.5 rounded-md bg-green-500 text-white text-sm hover:bg-green-600"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleDecline(proposal._id)}
                      className="px-4 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                      Decline
                    </button>
                  </>
                )}

                {proposal.status === "accepted" && (
                  <button
                    disabled
                    className="px-4 py-1.5 rounded-md bg-blue-500/60 text-white text-sm cursor-not-allowed"
                  >
                    Session Created
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedProposals;