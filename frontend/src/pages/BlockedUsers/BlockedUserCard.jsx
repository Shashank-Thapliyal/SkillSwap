import React, { useState } from 'react';
import { MapPin, Mars, Venus, Transgender } from 'lucide-react';
import { unblockUser } from '../../api/userApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BlockedUserCard = ({ user }) => {
    const [buttonText, setButtonText] = useState("Unblock User");
    const navigate = useNavigate();

    const handleUnblock = async () => {
        try {
            const response = await unblockUser(user._id);
            if (response.status === 200) {
                toast.success("User unblocked successfully");
                setButtonText("User Unblocked");
            }
        } catch (error) {
            toast.error("Error Unblocking the User");
        }
    };

    const buttonStyle =
        buttonText === "User Unblocked"
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30";

    return (
        <div className="relative bg-[#1E1E2F] p-6 rounded-lg border border-[#3C3C55] flex justify-between items-start">
            <div className="flex gap-4 flex-1">
                <img
                    src={user?.profile?.profilePic}
                    alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                    <div className="mb-3">
                        <h3 className="hover:cursor-pointer text-[#E0E0E0] text-lg font-medium mb-1" onClick={()=>navigate(`/profile/${user._id}`)}>
                            {user?.profile?.firstName} {user?.profile?.lastName}
                        </h3>

                        <div className='flex gap-2'>
            {user.profile.location && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin size={14} className="text-[#A0A0B0]" />
                <span className="text-[#A0A0B0] text-sm">{user.profile.location}</span>
              </div>
            )}
            {
              user?.profile?.gender && (
                <div className="flex items-center gap-1 mb-2">
                 {user.profile.gender === 'male' && <Mars size={14} className='text-[#A0A0B0]'/>} 
                 {user.profile.gender === 'female' && <Venus size={14} className='text-[#A0A0B0]'/>} 
                {user.profile.gender === 'others' && <Transgender size={14} className='text-[#A0A0B0]'/>}
                <span className="text-[#A0A0B0] text-sm">{user.profile.gender}</span>
              </div>
              )
            }
            </div>

                        {user?.profile?.about && (
                            <p className="text-[#A0A0B0] text-sm leading-relaxed mb-3 break-words">
                                {user.profile.about}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={handleUnblock}
                className={`${buttonStyle} px-4 py-2 rounded-md text-sm hover:opacity-90 transition`}
                disabled={buttonText === "User Unblocked"}
            >
                {buttonText} {buttonText === "User Unblocked" && <span>✔️</span>}
            </button>
        </div>
    );
};

export default BlockedUserCard;
