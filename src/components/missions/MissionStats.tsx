
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickStat {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor?: string;
}

interface MissionStatsProps {
  quickStats: QuickStat[];
}

const MissionStats: React.FC<MissionStatsProps> = ({ quickStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MissionStats;
