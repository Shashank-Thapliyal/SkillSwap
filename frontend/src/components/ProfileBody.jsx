import { Star } from "lucide-react";

const ProfileBody = ({ data }) => {
  
  const ratingBars = [
    { rating: 5, percent: 65 },
    { rating: 4, percent: 25 },
    { rating: 3, percent: 8 },
    { rating: 2, percent: 2 },
    { rating: 1, percent: 0 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* About Section */}
        <div className="bg-[#252538] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Me</h2>
          <p className="text-[#A0A0B0] leading-relaxed">{data?.profile?.about}</p>
        </div>

        {/* Skills I Can Teach */}
        <div className="bg-[#252538] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Skills I Can Teach</h2>
          <div className="flex flex-wrap gap-3">
            {data?.skills?.canTeach?.map((skill, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-[#34D399] to-[#10B981] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transform transition-transform"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-[#252538] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Skills I Want to Learn</h2>
          <div className="flex flex-wrap gap-3">
            {data?.skills?.wantToLearn?.map((skill, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-[#FF6B6B] to-[#EF4444] text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transform transition-transform"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Rating Breakdown */}
        <div className="bg-[#252538] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Rating Breakdown</h2>
          <div className="space-y-3">
            {ratingBars?.map(({ rating, percent }) => (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-[#A0A0B0] w-3">{rating}</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-[#2A2A40] rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[#A0A0B0] text-sm w-8">{percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-[#252538] rounded-xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Activity Overview</h2>
          <div className="space-y-3">
            {[
              { dot: "#34D399", label: "45 Sessions completed" },
              { dot: "#00C3FF", label: "122 connections" },
              { dot: "#FF6B6B", label: "14 Ratings" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-2 h-2 mt-2 rounded-full"
                  style={{ backgroundColor: activity.dot }}
                />
                <p className="text-[#A0A0B0] text-sm">{activity.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBody;
