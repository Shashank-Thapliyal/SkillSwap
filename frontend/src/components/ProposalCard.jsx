const ProposalCard = ({ proposal }) => (
    <div className="bg-[#252538] p-4 rounded-lg border border-[#3C3C55]">
      <div className="flex items-start space-x-3 mb-3">
        <img 
          src={proposal.fromAvatar} 
          alt={proposal.from}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-white">{proposal.from}</h4>
            <span className="text-xs text-[#A0A0B0]">{proposal.timestamp}</span>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs border border-green-500/30">
              Teaches: {proposal.teachingSkill}
            </span>
            <span className="bg-[#00C3FF]/20 text-[#00C3FF] px-2 py-1 rounded text-xs border border-[#00C3FF]/30">
              Wants: {proposal.learningSkill}
            </span>
          </div>
          <p className="text-sm text-[#A0A0B0] mb-3">{proposal.message}</p>
          <div className="flex space-x-2">
            <button className="bg-[#00C3FF] text-white px-3 py-1 rounded text-sm hover:bg-[#00C3FF]/80">
              Accept
            </button>
            <button className="bg-[#3C3C55] text-[#A0A0B0] px-3 py-1 rounded text-sm hover:bg-[#4A4A68]">
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
export default ProposalCard