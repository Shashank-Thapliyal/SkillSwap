import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const ProposalTabNavigation = ({ activeTab }) => {
  const { tab = "received" } = useParams();
  const tabs = [
    { id: 'received', name: 'Received' },
    { id: 'sent', name: 'Sent' },
  ];

  const navigate = useNavigate();

  const handleTabClick = (tabId) => {
    navigate(`/proposals/${tabId}`);
  };

  return (
    <div className="bg-[#1E1E2F] border-b border-[#3C3C55]">
      <div className="flex justify-center h-20">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => handleTabClick(tabItem.id)}
            className={`px-6 py-3 font-bold transition-colors ${
              (tab || 'received') === tabItem.id
                ? 'text-[#00C3FF] border-b-2 border-[#00C3FF]'
                : 'text-[#A0A0B0] hover:text-white'
            }`}
          >
            {tabItem.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProposalTabNavigation;
