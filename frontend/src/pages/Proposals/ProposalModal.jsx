import React from "react";
import ProposalCard from "./ProposalCard"; // import your card component

const ProposalModal = ({ proposals, onClose, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="bg-[#1F1F2E]/80 border border-[#3C3C55] rounded-xl shadow-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto relative backdrop-blur-lg scrollbar-thin scrollbar-track-[#2C2C3E] scrollbar-thumb-[#4B4B6A] hover:scrollbar-thumb-[#5E5E8A]">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          &times;
        </button>

        <h2 className="text-white text-lg font-semibold mb-4">All Proposals</h2>

        <div className="space-y-4">
          {proposals.length === 0 ? (
            <p className="text-gray-400 text-center">No proposals yet</p>
          ) : (
            proposals.map((proposal) => (
              <ProposalCard
                key={proposal._id}
                proposal={proposal}
                onCancel={onCancel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;