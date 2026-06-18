import Loader from "../../components/Loader.jsx"
import SessionItem from "./SessionItem.jsx"
// Sessions Tab Component
const SessionsTab = ({ sessions = [], isLoading }) => {

  const sortedSessions = Array.isArray(sessions)
    ? [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  return (isLoading ? <Loader  /> : (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-white text-lg font-semibold mb-4">Sessions</h3>

      {sortedSessions.length === 0 ? (
        <div className="text-center text-[#A0A0B0] mt-8">
          <p>No sessions yet</p>
          <p className="text-sm mt-2">Accept proposals to create sessions</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSessions?.map((session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>)
  );
};

export default SessionsTab;