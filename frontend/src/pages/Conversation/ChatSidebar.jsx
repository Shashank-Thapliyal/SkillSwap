import { Search, Plus } from "lucide-react";
import ChatListItem from "./ChatListItem";

const ChatSidebar = ({ chatList, selectedChat, onChatSelect, onStartNew }) => {
  return (
    <div className="w-1/3 bg-[#1E1E2F] border-r border-[#3C3C55] relative flex flex-col">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#3C3C55]">
        <h2 className="text-white text-xl font-semibold mb-3">Messages</h2>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 text-[#A0A0B0]" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-[#2C2C3E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00C3FF]"
          />
        </div>

        {/* Start New Conversation Button */}
        <button
          onClick={onStartNew}
          className="w-full flex items-center justify-center gap-2 bg-[#00C3FF] hover:bg-[#00acd6] text-black hover:cursor-pointer font-medium py-2 rounded-lg transition-all"
        >
          <Plus size={16} /> Start New Conversation
        </button>
      </div>

      {/* Chat List */}
      <div className="overflow-y-auto flex-1">
        {chatList?.map((chat) => (
          <ChatListItem
            key={chat._id}
            chat={chat}
            isSelected={selectedChat?._id === chat._id}
            onClick={() => onChatSelect(chat)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
