import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatTime } from "../../utils/dateFormatter.js";

const SessionItem = ({ session, onSessionUpdate }) => {
    const loggedInUser = useSelector((state) => state.user);
    const navigate = useNavigate();

    const isLearner = session.learner?._id === loggedInUser?._id;
    const role = isLearner ? "learner" : "teacher";
    const formattedTime = formatTime(session?.scheduledAt);

    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const canJoinFrom = new Date(sessionTime.getTime() - 15 * 60 * 1000);
    const canJoinUntil = new Date(sessionTime.getTime() + 15 * 60 * 1000);

    const canJoin = now >= canJoinFrom && now <= canJoinUntil;
    const isPast = now > canJoinUntil;
    const isUpcoming = now < canJoinFrom;

    const statusConfig = {
        scheduled: {
            classes: isPast
                ? "bg-amber-500/20 text-amber-400"
                : "bg-cyan-500/20 text-cyan-400",
            dot: isPast ? "bg-amber-400" : "bg-cyan-400",
            label: isPast ? "Missed" : "Scheduled",
        },
        completed: {
            classes: "bg-gray-500/20 text-gray-400",
            dot: "bg-gray-400",
            label: "Completed",
        },
        cancelled: {
            classes: "bg-red-500/20 text-red-400",
            dot: "bg-red-400",
            label: "Cancelled",
        },
    };

    const currentStatus = statusConfig[session.status] || statusConfig.completed;

    const accentColor = {
        scheduled: isPast ? "#f59e0b" : "#00C3FF",
        completed: "#6b7280",
        cancelled: "#ef4444",
    }[session.status] || "#6b7280";

    const handleReschedule = async () => {
        // open your reschedule modal/flow and call:
        // await axios.patch(`/api/sessions/reschedule/${session._id}`, { scheduledAt: newTime });
        // then call onSessionUpdate() to refresh the list
    };

    const handleCancel = async () => {
        try {
            await axios.patch(`/api/sessions/cancel/${session._id}`);
            onSessionUpdate?.();
        } catch (err) {
            console.error("Failed to cancel session", err);
        }
    };

    const handleViewDetails = () => {
        navigate(`/sessions/details/${session._id}`);
    };

    return (
        <div
            className="bg-[#2C2C3E] rounded-xl p-4 border border-[#3C3C55] hover:border-[#00C3FF]/30 transition-all cursor-pointer"
            style={{ borderLeft: `3px solid ${accentColor}` }}
        >
            {/* Main Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${accentColor}20` }}
                    >
                        {role === "learner" ? "🎓" : "🧑‍🏫"}
                    </div>

                    <div>
                        <p className="text-white text-sm font-semibold">
                            {role === "learner" ? "Learning Session" : "Teaching Session"}
                        </p>
                        <p className="text-[#A0A0B0] text-xs mt-0.5">
                            📅 {formattedTime || "Time not set"}
                        </p>
                    </div>
                </div>

                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.classes}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                    {currentStatus.label}
                </span>
            </div>

            {/* CTA Section */}
            <div className="mt-4">

                {/* Joinable window */}
                {session.status === "scheduled" && canJoin && (
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A0A0B0] border border-[#3C3C55] hover:border-red-400/50 hover:text-red-400 transition-colors"
                        >
                            Cancel
                        </button>
                        <a
                            href={session.callLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center bg-[#00C3FF] text-[#0D0D1A] px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#00C3FF]/90 transition-colors"
                        >
                            Join Session
                        </a>
                    </div>
                )}

                {/* Upcoming but not yet joinable */}
                {session.status === "scheduled" && isUpcoming && (
                    <div className="flex items-center justify-between">
                        <p className="text-[#A0A0B0] text-xs">
                            🕐 Opens 15 min before session
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A0A0B0] border border-[#3C3C55] hover:border-red-400/50 hover:text-red-400 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReschedule}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A0A0B0] border border-[#3C3C55] hover:border-[#A0A0B0]/50 hover:text-white transition-colors"
                            >
                                Reschedule
                            </button>
                        </div>
                    </div>
                )}

                {/* Missed */}
                {session.status === "scheduled" && isPast && (
                    <div className="flex items-center justify-between">
                        <p className="text-amber-400/70 text-xs">
                            ⚠️ Session time has passed
                        </p>
                    </div>
                )}

                {/* Completed */}
                {session.status === "completed" && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleViewDetails}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#A0A0B0] border border-[#3C3C55] hover:border-[#00C3FF]/40 hover:text-[#00C3FF] transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                )}

                {/* Cancelled */}
                {session.status === "cancelled" && (
                    <p className="text-red-400/70 text-xs">
                        ❌ This session was cancelled
                    </p>
                )}

            </div>
        </div>
    );
};

export default SessionItem;