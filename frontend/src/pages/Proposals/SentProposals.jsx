import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import Loader from "../../components/Loader";
import ProposalCard from "./ProposalCard";

import {
  getSentProposals,
  cancelProposalRequest,
} from "../../api/proposalApi";

const SentProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector((state) => state.user);

  const fetchSentProposals = async () => {
    try {
      setLoading(true);
      const response = await getSentProposals(loggedInUser?._id);
      console.log(response.data.proposals);
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
    if (loggedInUser?._id) {
      fetchSentProposals();
    }
  }, [loggedInUser?._id]);

  const handleCancelProposal = async (proposalId) => {
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

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-[#1E1E2F] rounded-lg border border-[#3C3C55] shadow-lg">
      <h2 className="text-2xl text-white font-bold mb-6">
        Sent Proposals
      </h2>

      {proposals.length === 0 ? (
        <p className="text-white text-center">
          No proposals sent yet.
        </p>
      ) : (
        <div className="space-y-6">
          {proposals.map((proposal) => (
            <div key={proposal._id}>
              <ProposalCard 
                proposal={proposal} 
                direction="sent"
                hideCancelButton={false}
              />

              {/* ACTIONS */}
              <div className="flex gap-3 mt-3">
                {proposal.status === "pending" && (
                  <button
                    onClick={() => handleCancelProposal(proposal._id)}
                    className="px-4 py-1.5 rounded-md bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}

                {proposal.status === "accepted" && (
                  <button
                    disabled
                    className="px-4 py-1.5 rounded-md bg-green-500/60 text-white text-sm cursor-not-allowed"
                  >
                    Accepted
                  </button>
                )}

                {proposal.status === "declined" && (
                  <button
                    disabled
                    className="px-4 py-1.5 rounded-md bg-red-500/60 text-white text-sm cursor-not-allowed"
                  >
                    Declined
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

export default SentProposals;
