import React from 'react';

const ConnectionCard = ({ connection, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(connection)}
      className="flex items-center px-4 py-3 hover:bg-[#1F1F2E] cursor-pointer transition-all duration-200"
    >
      <img
        src={connection.profile?.profilePic}
        alt={connection.profile?.firstName}
        className="w-10 h-10 rounded-full object-cover mr-4"
      />
      <div className="flex-1">
        <h4 className="text-white font-medium">{connection.profile?.firstName} {connection.profile?.middleName} {connection.profile?.lastName}</h4>
        {connection?.profile?.about && (
          <p className="text-gray-400 text-sm truncate">{connection.profile?.about.slice(0,55)} {connection.profile.about.slice(55,).length > 0 &&"..."}</p>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
