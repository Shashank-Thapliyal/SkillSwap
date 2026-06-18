import { useParams } from "react-router-dom";
import { formatTime } from "../../utils/dateFormatter";

const MessageItem = ({ message }) => {
  const { content, createdAt, sender } = message;
  const { userId } = useParams();

  const formattedTime = formatTime(createdAt);

  return (
    <div className={`flex ${userId === sender._id ? "justify-start" : "justify-end"}`}>
      <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-[#2C2C3E] text-white">
        <p>{content}</p>
        <p className="text-xs mt-1 text-[#A0A0B0]">{formattedTime}</p>
      </div>
    </div>
  );
};

export default MessageItem;