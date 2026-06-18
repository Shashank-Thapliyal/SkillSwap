import React from "react";

const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-300 border-yellow-400/30",
  cancelled: "bg-gray-500/10 text-gray-300 border-gray-400/30",
  declined: "bg-red-500/10 text-red-400 border-red-400/30",
  accepted: "bg-green-500/10 text-green-300 border-green-400/30",
};

const ProposalCard = ({
  proposal,
  direction = "sent",
  onCancel,
  onAccept,
  onReject,
  canCancel,
}) => {

  const profileUser = direction === "received" ? proposal.sender : proposal.receiver || proposal.sender;
  const user = profileUser?.profile;
  const canShowCancel = canCancel ?? Boolean(onCancel);
  const canRespond = direction === "received" && Boolean(onAccept || onReject);

  return (
    <div className="bg-[#2C2C3E] p-5 rounded-xl border border-[#3C3C55] shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={user?.profilePic}
            alt={user?.firstName}
            className="w-11 h-11 rounded-full border border-[#3C3C55]"
          />
          <div>
            <p className="text-white font-semibold leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-400 my-1">
              {direction === "received" ? "Received Proposal" : "Sent Proposal"}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full border capitalize ${statusStyles[proposal.status] || statusStyles.pending}`}
        >
          {proposal.status}
        </span>
      </div>

      <div className="bg-[#252536] p-3 rounded-lg mb-4 text-sm text-[#E0E0E0]">
        <p className="italic">"{proposal.message}"</p>
      </div>

      <div className="text-sm text-[#E0E0E0] space-y-2">
        <p>
          <span className="text-gray-400">Payment:</span>{" "}
          <span className="capitalize">{proposal.paymentType}</span>
        </p>

        <div>
          <p className="text-gray-400 mb-1">Proposed Time Slots</p>
          <div className="flex flex-wrap gap-2">
            {proposal.proposedTimeSlots.map((slot, index) => (
              <span
                key={index}
                className="bg-[#3C3C55] px-3 py-1 rounded-full text-xs"
              >
                {new Date(slot).toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        {proposal.status === "pending" && canRespond && (
          <>
            <button
              onClick={onAccept}
              className="px-4 py-2 bg-green-500/90 hover:bg-green-600 text-white text-sm rounded-md"
            >
              Accept Proposal
            </button>
            <button
              onClick={onReject}
              className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white text-sm rounded-md"
            >
              Reject Proposal
            </button>
          </>
        )}

        {proposal.status === "pending" && !canRespond && canShowCancel && (
          <button
            onClick={() => onCancel?.(proposal._id)}
            className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white text-sm rounded-md"
          >
            Cancel Proposal
          </button>
        )}

        {proposal.status === "cancelled" && (
          <span className="text-sm text-yellow-300">
            You cancelled this proposal
          </span>
        )}

        {proposal.status === "declined" && (
          <span className="text-sm text-red-400">
            {direction === "received"
              ? "You rejected this proposal"
              : `${user?.firstName || "User"} declined this proposal`}
          </span>
        )}

        {proposal.status === "accepted" && (
          <span className="text-sm text-green-300">
            Session created
          </span>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
