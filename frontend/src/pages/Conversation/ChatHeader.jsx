import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";

const ChatHeader = ({ selectedChat }) => {
  return (
      <div className="bg-[#1E1E2F] p-4 border-b border-[#3C3C55] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={selectedChat?.profile?.profilePic}
            alt={selectedChat?.profile?.firstName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="text-white font-medium">{selectedChat?.profile?.firstName} {selectedChat?.profile?.lastName}</h3>
            <p className="text-[#A0A0B0] text-sm">online</p>
          </div>
        </div>
        <div className="flex gap-4">
          <MoreVertical className="text-[#A0A0B0] cursor-pointer hover:text-white" size={20} />
        </div>
      </div>
    );
  };
  
  export default ChatHeader;  