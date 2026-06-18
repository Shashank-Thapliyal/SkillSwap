import { Search } from "lucide-react";

const EmptyState = () => {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-[#A0A0B0]">
          <div className="w-24 h-24 bg-[#2C2C3E] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
          <p>Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    );
  };
  
  export default EmptyState;  