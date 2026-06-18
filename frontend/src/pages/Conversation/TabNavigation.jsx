import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setConversationTab } from "../../../store/uiSlice";

const TabNavigation = ({ activeTab }) => {
  const {userId} = useParams();    
  const tabs = [
      { id: 'chat', name: 'Chat' },
      { id: 'proposals', name: 'Proposals' },
      { id: 'sessions', name: 'Sessions' }
    ];
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleTabClick = (tab) => {
      const newPath = `/conversations/${userId}/${tab.id}`;
      dispatch(setConversationTab(`${tab.name}`))
      navigate(newPath);
    };
  
    return (
      <div className="bg-[#1E1E2F] border-b border-[#3C3C55]">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#00C3FF] border-b-2 border-[#00C3FF]'
                  : 'text-[#A0A0B0] hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    );
  };
  export default TabNavigation;  