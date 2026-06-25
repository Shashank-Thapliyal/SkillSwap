import { useNavigate } from "react-router-dom";

const ProposalCard = ({ proposal }) => {
  const navigate = useNavigate();
  
  const user = proposal?.sender;

  return (
    <div className="bg-[#252538] p-4 rounded-lg border border-[#3C3C55]">
      <div className="flex items-start space-x-3 mb-3">
        <img 
          src={user?.profile?.profilePic} 
          alt={proposal.from}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-white">{user?.profile?.firstName + " " + user?.profile?.lastName}</h4>
            
          </div>
          <p className="text-sm text-[#A0A0B0] mb-3">{proposal.message}</p>
          <div className="flex space-x-2">
            <button className="bg-[#00C3FF] text-black px-3 py-1 rounded text-sm hover:bg-[#00C3FF]/80" onClick={e => { e.preventDefault(); navigate("/proposals")}}>
              view details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProposalCard