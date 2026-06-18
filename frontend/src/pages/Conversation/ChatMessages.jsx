import { Send } from "lucide-react";
import MessageItem from "./MessageItem";
import Loader from "../../components/Loader.jsx"
import { useEffect, useRef } from "react";


const ChatMessages = ({ messages, messageInput, setMessageInput, onSendMessage, isLoading }) => {

  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {  
      container.scrollTop = container.scrollHeight; 
    }
  }, [messages]);
  
  //optimise the api to fetch recent 100 messages at a time

  return (isLoading ? <Loader /> : (
    <>
      <div ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-200px)]">
        {messages?.map((message, idx) => (
          <MessageItem key={idx} message={message} />
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-[#1E1E2F] p-4 border-t border-[#3C3C55]">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-[#2C2C3E] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00C3FF]"
            />
          </div>
          <button
            onClick={onSendMessage}
            className="bg-[#00C3FF] text-white p-2 rounded-lg hover:bg-[#00B2F0] transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </>)
  );
};

export default ChatMessages;  