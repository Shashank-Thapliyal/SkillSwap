import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const UserCard = ({ user, primaryAction, secondaryAction }) => {
    if (!user) return null;
    
    return (
      <div className="relative bg-[#1E1E2F] p-4 rounded-lg border border-[#3C3C55] flex justify-between flex-col items-start">
        <div className="flex items-start gap-4 w-full">
          {
            (user?.profile?.profilePic) ?
            <img
            src={user?.profile?.profilePic}
            alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
          />
          :
          <User />
          }
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium mb-2">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </p>
            <p className="text-[#A0A0B0] text-sm  mb-2">
              {user?.profile?.about?.slice(0,100)} ...
            </p>
            
            <div className="text-[#b0b0b4] text-sm">
              
              <span className="block mb-1">Teaches :</span>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.canTeach?.length > 0 ? (
                  user.skills.canTeach.map(skill => (
                    <span 
                      key={skill._id} 
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap"
                    >
                      {skill.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[#A0A0B0] text-xs ml-2">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2 w-full">
          {secondaryAction && (
            
            <button 
              className="bg-[#3C3C55] text-[#A0A0B0] px-3 py-1 rounded text-sm hover:bg-[#4A4A68]"
              onClick={() => secondaryAction.action(user)}
            >
              {secondaryAction.name}
            </button>
          )}
          {primaryAction && (
            <button
              className="text-sm bg-[#00C3FF] text-black px-3 py-1 rounded hover:bg-[#00C3FF]/80"
              onClick={() => primaryAction.action(user)}
            >
              {primaryAction.name}
            </button>
          )}
        </div>
      </div>
    );
  };

  export default UserCard;