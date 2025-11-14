import React from "react";

const ProposalCard = ({ proposal, onCancel }) => {
  const from = proposal.sender?.profile;
  const to = proposal.receiver?.profile;

  return (
    <div className="bg-[#2C2C3E] p-5 rounded-xl border border-[#3C3C55] shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={from?.profilePic}
            alt="From Avatar"
            className="w-10 h-10 rounded-full border border-[#3C3C55]"
          />
          <div>
            <p className="text-white text-sm">From</p>
            <p className="text-white font-semibold">{from?.firstName} {from?.lastName}</p>
          </div>
        </div>

        <div className="text-white text-xl">→</div>

        <div className="flex items-center gap-3">
          <img
            src={to?.profilePic}
            alt={to?.firstName}
            className="w-10 h-10 rounded-full border border-[#3C3C55]"
          />
          <div>
            <p className="text-white text-sm">To</p>
            <p className="text-white font-semibold">{to?.firstName} {to?.lastName}</p>
          </div>
        </div>
      </div>

      <div className="text-[#E0E0E0] space-y-2 text-sm">
        <p><span className="font-semibold">Message:</span> {proposal.message}</p>
        <p><span className="font-semibold">Status:</span> {proposal.status}</p>
        <p><span className="font-semibold">Payment Type:</span> {proposal.paymentType}</p>
        <p>
          <span className="font-semibold">Time Slots:</span>{" "}
          {proposal.proposedTimeSlots.map((slot, index) => (
            <span
              key={index}
              className="inline-block bg-[#3C3C55] px-2 py-1 rounded-md text-xs mr-2 mt-1"
            >
              {new Date(slot).toLocaleString()}
            </span>
          ))}
        </p>
      </div>

      <div className="flex justify-end mt-4">
        {proposal.status === "pending" && (
          <button
            onClick={() => onCancel(proposal._id)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
          >
            Cancel Proposal
          </button>
        )}

        {proposal.status === "cancelled" && (
          <span className="px-3 py-1 rounded-md bg-[#3C3C55] text-yellow-300 text-sm font-medium">
            You cancelled this proposal
          </span>
        )}

        {proposal.status === "declined" && (
          <span className="px-3 py-1 rounded-md bg-[#3C3C55] text-red-400 text-sm font-medium">
            {to?.firstName || "They"} declined this proposal
          </span>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
