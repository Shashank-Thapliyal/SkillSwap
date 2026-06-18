import { useNavigate } from "react-router-dom";
import { PrimaryButton, SecondaryButton } from "./Buttons";
import { toast } from "react-toastify";
import { sendConnectionRequest } from "../api/requestApi";
import { useState } from "react";

const UserCard = ({ user }) => {
  const [requestSent, setRequestSent] = useState(false);
  console.log("render : " , user)
  const navigate = useNavigate();
  
  const getAvatarUrl = (user) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`
    )}&size=200&background=random&color=fff&bold=true&format=svg`;
  };
  
  const handleConnect = async ()=>{
    try {
      if(requestSent) {
        return ;
      }

      const response = await sendConnectionRequest(user._id);
      console.log(response);
      if(response.status === 201){
        toast.success("Request sent successfully.");
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send request");
    }

  }
  return (
    <div className="relative rounded-2xl overflow-hidden hover:bg-[#2A2A40] transition-colors cursor-pointer shadow-xl border border-[#3C3C55] bg-[#1E1E2F]">
      <div className="relative h-52 w-full overflow-hidden">
        {user?.profile?.profilePic ? (
          <>
            <img
              src={user.profile.profilePic}
              className="h-full w-full object-cover"
              alt="avatar"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2F] via-[#1E1E2F]/20 to-transparent"></div>
          </>
        ) : (
          <div className="h-full w-full relative overflow-hidden bg-gradient-to-br from-[#2A2A40] to-[#1E1E2F]">
            <img
              src={getAvatarUrl(user)}
              className="h-full w-full object-cover scale-110"
              alt="Generated avatar"
              onError={(e) => {
                e.target.src = `https://source.boringavatars.com/marble/200/${user?.profile?.userName || 'default'}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2F]/40 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Status indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
          <span className="text-white text-xs font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">Online</span>
        </div>
      </div>

      <div className="p-6 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00C3FF]/50 to-transparent"></div>
        <div className="absolute top-2 left-6 w-12 h-px bg-gradient-to-r from-[#00C3FF]/60 to-transparent"></div>

        <div className="mb-5">
          <h3 className="text-xl font-bold text-white mb-2">
            {user?.profile?.firstName || 'Unknown'} {user?.profile?.lastName || 'User'}
          </h3>
          <p className="text-[#A0A0B0] text-sm font-medium flex items-center">
            <span className="text-[#00C3FF]">@</span>{user?.profile?.userName || 'username'}
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/30">
            <span className="text-yellow-400 text-base">⭐</span>
            <span className="text-white text-sm font-bold">4.5</span>
          </div>
          <div className="text-[#A0A0B0] text-sm bg-[#1E1E2F] px-3 py-2 rounded-full border border-[#3C3C55]">
            <span className="font-bold text-[#00C3FF]">50+</span> sessions
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(user?.skills?.canTeach || [{ name: 'JavaScript' }, { name: 'React' }, { name: 'Node.js' }]).slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-[#00C3FF]/20 to-[#00C3FF]/10 text-[#00C3FF] px-3 py-2 rounded-full text-xs font-semibold border border-[#00C3FF]/30"
              >
                {skill.name}
              </span>
            ))}
            {(user?.skills?.canTeach?.length || 0) > 3 && (
              <span className="text-[#A0A0B0] text-xs px-3 py-2 bg-[#1E1E2F] rounded-full border border-[#3C3C55]">
                +{(user?.skills?.canTeach?.length || 0) - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <PrimaryButton 
          disabled={requestSent}
          onClick={handleConnect}
          className="w-full h-12 text-sm font-bold rounded-xl flex items-center justify-center">
           {requestSent? "Request Sent" : " Connect"}
          </PrimaryButton>
          <SecondaryButton className="w-full h-12 text-sm font-bold rounded-xl flex items-center justify-center"
            onClick={() => {
              navigate(`/profile/${user._id}`)
            }}>
            View Profile
          </SecondaryButton>
        </div>


      </div>
    </div>
  );
};

export default UserCard;