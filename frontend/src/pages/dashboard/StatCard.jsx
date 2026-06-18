import React from 'react';
import {TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend = 'up' }) => (
    <div className="bg-[#252538] p-6 rounded-lg border border-[#3C3C55] shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#A0A0B0]">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center mt-1`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="bg-[#00C3FF]/20 p-3 rounded-full">
          <Icon className="w-6 h-6 text-[#00C3FF]" />
        </div>
      </div>
    </div>
  );

export default StatCard;