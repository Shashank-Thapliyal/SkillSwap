import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
} from 'lucide-react';

const SessionCard = ({ session }) => (
    
    <div className="bg-[#252538] p-4 rounded-lg border border-[#3C3C55] hover:shadow-md transition-shadow hover:border-[#00C3FF]/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={session.partnerAvatar}
            alt={session.partner}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-white">{session.partner}</h4>
            <p className="text-sm text-[#A0A0B0]">{session.skill}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.type === 'Teaching'
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-[#00C3FF]/20 text-[#00C3FF] border border-[#00C3FF]/30'
          }`}>
          {session.type}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-[#A0A0B0]">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {session.date}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {session.time}
          </span>
        </div>
        <button className="text-[#00C3FF] hover:text-[#00C3FF]/80 font-medium">
          Join
        </button>
      </div>
    </div>
  );

export default SessionCard;