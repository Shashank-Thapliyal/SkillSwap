import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../api/api";
import SessionItem from "../Conversation/SessionItem";
import Loader from "../../components/Loader";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "missed", label: "Missed" },
  { id: "cancelled", label: "Cancelled" },
];

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [missed, setMissed] = useState([]);
  const [cancelled, setCancelled] = useState([]);

  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector((state) => state.user);


  const fetchSessions = async () => {
    try {
      setLoading(true);

      const [
        upcomingRes,
        completedRes,
        missedRes,
        cancelledRes,
      ] = await Promise.all([
        api.get("/sessions/upcoming"),
        api.get("/sessions/completed"),
        api.get("/sessions/missed"),
        api.get("/sessions/cancelled"),
      ]);

      setUpcoming(
        [...(upcomingRes.data?.data || [])].sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
        )
      );

      setCompleted(
        [...(completedRes.data?.data || [])].sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
        )
      );

      setMissed(
        [...(missedRes.data?.data || [])].sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
        )
      );

      setCancelled(
        [...(cancelledRes.data?.data || [])].sort(
          (a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)
        )
      );
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSessions();
  }, []);



  const sessionsMap = {
    upcoming,
    completed,
    missed,
    cancelled,
  };

  const counts = {
    upcoming: upcoming.length,
    completed: completed.length,
    missed: missed.length,
    cancelled: cancelled.length,
  };


  const sessions = sessionsMap[activeTab] || [];


  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      {/* Header */}
      <div className="bg-[#1E1E2F] border-b border-[#3C3C55] px-6 py-5">
        <h1 className="text-xl font-semibold text-white">Sessions</h1>
        <p className="text-[#A0A0B0] text-sm mt-0.5">
          Manage your learning and teaching sessions
        </p>
      </div>

      {/* Tab Nav */}
      <div className="bg-[#1E1E2F] border-b border-[#3C3C55]">
        <div className="flex px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === tab.id
                ? "text-[#00C3FF] border-[#00C3FF]"
                : "text-[#A0A0B0] border-transparent hover:text-white"
                }`}
            >
              {tab.label}

              {counts[tab.id] > 0 && (
                <span className="ml-2 bg-[#00C3FF]/20 text-[#00C3FF] text-xs px-2 py-0.5 rounded-full">
                  {counts[tab.id]}
                </span>
              )}


            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <Loader />
        ) : sessions.length === 0 ? (


          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#2C2C3E] flex items-center justify-center mb-4 text-3xl">
              {activeTab === "upcoming"
                ? "📅"
                : activeTab === "completed"
                  ? "✅"
                  : activeTab === "missed"
                    ? "⏰"
                    : "❌"}
            </div>

            <p className="text-white font-semibold text-lg">
              {activeTab === "upcoming"
                ? "No upcoming sessions"
                : activeTab === "completed"
                  ? "No completed sessions"
                  : activeTab === "missed"
                    ? "No missed sessions"
                    : "No cancelled sessions"}
            </p>

            <p className="text-[#A0A0B0] text-sm mt-2">
              {activeTab === "upcoming"
                ? "Accept a proposal to schedule a session with a connection."
                : activeTab === "completed"
                  ? "Your completed sessions will show up here."
                  : activeTab === "missed"
                    ? "You don't have any missed sessions."
                    : "You don't have any cancelled sessions."}
            </p>


          </div>

        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <SessionItem
                key={session._id}
                session={session}
                onSessionUpdate={fetchSessions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;



/*
 MAKE THE SESSION CARD SUCH THAT THEY CONTAIN THE NAME AND INFO OF OTHER USERS;

 */
