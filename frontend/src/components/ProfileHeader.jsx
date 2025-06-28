import { Star, MapPin, Calendar, Edit, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileHeader = ({ data, isOwnProfile }) => {
  const [joining, setJoining] = useState("");
  const navigate = useNavigate();

  const renderStars = (rating) => {
    if (!rating) return null;
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    const empty = 5 - Math.ceil(rating);
    return (
      <>
        {Array(full).fill().map((_, i) => (
          <Star key={`f-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {half && <Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />}
        {Array(empty).fill().map((_, i) => (
          <Star key={`e-${i}`} className="w-4 h-4 text-gray-400" />
        ))}
      </>
    );
  };

  useEffect(() => {
    if (data?.createdAt) {
      const toFormat = new Date(data.createdAt);
      const formatted = toFormat.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long"
      });
      setJoining(formatted);
    }
  }, [data?.createdAt]);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return `${age} years old`;
  };


  return (
    <div className="bg-[#252538] rounded-xl shadow-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#00C3FF] shadow-lg bg-[#1E1E2F] flex items-center justify-center text-6xl text-white">
          {data?.profile?.profilePic ? (
            <img src={data.profile.profilePic} alt="Profile Pic" className="w-full h-full object-cover" />
          ) : (
            <span role="img" aria-label="user">👤</span>
          )}
        </div>


        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {data?.profile?.firstName} {data?.profile?.middleName} {data?.profile?.lastName}
              </h1>

              <div className="flex items-center gap-4 mb-2">
                <p className="text-[#00C3FF] text-lg font-medium">
                  @{data?.profile?.userName}
                </p>

                <span className="text-sm text-[#A0A0B0] font-medium mt-0.5">
                  • {calculateAge(data?.profile?.dob)}
                </span>
              </div>


              <div className="flex flex-wrap items-center gap-4 text-[#A0A0B0] mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data?.profile?.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined :&nbsp;{joining}
                </span>
              </div>
              {
                data?.rating ?
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1">{renderStars(data?.rating)}</div>
                    <span className="text-white font-semibold">{data?.rating}</span>
                    <span className="text-[#A0A0B0]">({data?.totalReviews} reviews)</span>
                  </div>
                  :
                  <div className="flex items-center gap-2 mb-4 text-[#A0A0B0] ml-2">
                    No reviews yet
                  </div>
              }

              <div className="flex gap-6 text-sm">
                <Stat count={data?.completedSessions ? data?.completedSessions : "0"} label="Sessions" color="#00C3FF" />
                <Stat count={data?.skills?.canTeach?.length} label="Can Teach" color="#34D399" />
                <Stat count={data?.skills?.wantToLearn?.length} label="Learning" color="#FF6B6B" />
              </div>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {isOwnProfile ? (
                <button className="flex items-center gap-2 bg-[#00C3FF] text-white px-4 py-2 rounded-lg hover:bg-[#00A8D6] transition" onClick={() => navigate("/edit-profile")}>
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <>
                  <button className="flex items-center gap-2 bg-[#00C3FF] text-white px-4 py-2 rounded-lg hover:bg-[#00A8D6] transition">
                    <MessageCircle className="w-4 h-4" /> Message
                  </button>
                  <button className="flex items-center gap-2 bg-[#34D399] text-white px-4 py-2 rounded-lg hover:bg-[#10B981] transition">
                    Book Session
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ count, label, color }) => (
  <div className="text-center">
    <div className="text-2xl font-bold" style={{ color }}>{count}</div>
    <div className="text-[#A0A0B0]">{label}</div>
  </div>
);

export default ProfileHeader;
