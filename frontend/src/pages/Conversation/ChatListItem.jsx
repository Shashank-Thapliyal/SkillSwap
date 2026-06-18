import {formatTime} from "../../utils/dateFormatter.js"

const ChatListItem = ({ chat, isSelected, onClick }) => {
  
  const {participants, lastMessage, _id} = chat;
  const profile = participants[0].profile || {};

  const formattedTime = formatTime(lastMessage?.createdAt)
  
    return (
      <div
        onClick={onClick}
        className={`p-4 cursor-pointer hover:bg-[#2C2C3E] transition-colors ${
          isSelected ? 'bg-[#2C2C3E]' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={profile?.profilePic}
            alt={profile?.firstName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">{profile?.firstName} {profile?.middleName} {profile?.lastName}</h3>
              <span className="text-[#A0A0B0] text-xs">{formattedTime}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
             { lastMessage?.type === "text" && <p className="text-[#A0A0B0] text-sm truncate">{lastMessage?.content}</p>}              {chat.unread > 0 && (
                <span className="bg-[#00C3FF] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {/* {chat.unread} */} 1
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChatListItem;  