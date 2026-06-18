import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from "../../components/Loader";
import {

  Calendar,
  MessageSquare,
  Users,
  Trophy,
  BookOpen,
  Settings,
  Search,
  Plus,
  Star,
  Clock,
  ArrowUpRight,
  User,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  Zap,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Send
} from 'lucide-react';
import { PrimaryButton } from '../../components/Buttons';
import ProposalCard from '../../components/ProposalCard';
import { toast } from "react-toastify";
import UserCard from './UserCard';
import StatCard from './StatCard';
import SessionCard from './SessionCard';
import { useNavigate } from 'react-router-dom';
import { withdrawConnectionRequest, acceptConnectionRequest, rejectConnectionRequest } from "../../api/requestApi.js"
import { setUser } from '../../../store/userSlice.js';
import api from '../../api/api.js';
import { useDispatch } from 'react-redux';
import useConnectionHandlers from '../../hooks/useConnectionHanlders.js';

import { getDashboardData } from '../../api/userApi.js';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const loggedInUser = useSelector(state => state.user);
  const navigate = useNavigate();

  const { handleAcceptRequest,
    handleRejectRequest,
    handleWithdrawRequest,
    handleViewProfile } = useConnectionHandlers();

  const [dashboardData, setDashboardData] = useState({
    upcomingSessions: [],
    recentProposals: [],
    stats: {},
  });

  useEffect(() => {
    console.log("dashboardData", dashboardData);
  }, [dashboardData]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await getDashboardData();
        console.log(res);
        if (res.status === 200) {
          setDashboardData(res.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch dashboard data");
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewSessions = (e) => {
    e.preventDefault();
    navigate("/sessions");
  }
  const handleViewProposals = (e) => {
    e.preventDefault();
    navigate("/proposals");
  }

  useEffect(() => {
    setLoading(false);
  }, [loggedInUser]);

  if (loading) {
    return <Loader />;
  }

  console.log(loggedInUser?.skills?.canTeach)

  return (
    <div className="min-h-screen bg-[#1E1E2F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {loggedInUser?.profile?.firstName} !
          </h1>
          <p className="text-[#A0A0B0]">Ready to learn something new or share your expertise?</p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">My Sessions</h2>
                <button className="flex items-center text-[#00C3FF] hover:text-[#00C3FF]/80 text-sm font-medium"
                  onClick={handleViewSessions}>
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>


              <div className="space-y-4">
                {dashboardData.upcomingSessions.length > 0 ? (
                  dashboardData.upcomingSessions.map((session) => (
                    <SessionCard
                      key={session._id}
                      session={session}
                    />
                  ))
                ) : (
                  <div className="border border-dashed border-[#3C3C55] rounded-lg p-8 text-center">
                    <Calendar className="w-12 h-12 text-[#A0A0B0] mx-auto mb-3" />

                    <h3 className="text-white font-medium mb-2">
                      No upcoming sessions
                    </h3>

                    <p className="text-[#A0A0B0] text-sm mb-4">
                      Start connecting with learners and schedule your first session.
                    </p>

                  </div>
                )}
              </div>

            </div>

            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">New Proposals</h2>
                <button className="flex items-center text-[#00C3FF] hover:text-[#00C3FF]/80 text-sm font-medium"
                  onClick={handleViewProposals}>
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentProposals.length > 0 ? (
                  dashboardData.recentProposals.map((proposal) => (
                    <ProposalCard
                      key={proposal._id}
                      proposal={proposal}
                    />
                  ))
                ) : (
                  <div className="border border-dashed border-[#3C3C55] rounded-lg p-8 text-center">
                    <Send className="w-12 h-12 text-[#A0A0B0] mx-auto mb-3" />

                    <h3 className="text-white font-medium mb-2">
                      No new proposals
                    </h3>

                    <p className="text-[#A0A0B0] text-sm mb-4">
                      Send a proposal to start a skill exchange.
                    </p>

                  </div>
                )}
              </div>


            </div>

            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Your Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-green-400" />
                    Can Teach
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {loggedInUser?.skills?.canTeach?.map(skill => (
                      <span key={skill?._id} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-[#00C3FF]" />
                    Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {loggedInUser?.skills?.wantToLearn.map(skill => (
                      <span key={skill._id} className="bg-[#00C3FF]/20 text-[#00C3FF] px-3 py-1 rounded-full text-sm border border-[#00C3FF]/30">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 border border-[#3C3C55] text-[#A0A0B0] py-2 px-4 rounded-lg hover:bg-[#3C3C55]/30 transition-colors" onClick={(e)=>{e.preventDefault(); navigate("/profile")}}>
                Update Skills
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <PrimaryButton className="w-full bg-[#00C3FF] text-black py-2 px-4 rounded-lg hover:bg-[#00C3FF]/80 flex items-center justify-center transition-colors">
                  <Users className="w-5 h-5 mr-2" />
                  Find Learning Partners
                </PrimaryButton>
                <button className="w-full border border-[#3C3C55] text-[#A0A0B0] py-2 px-4 rounded-lg hover:bg-[#3C3C55]/30 flex items-center justify-center transition-colors">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Calendar
                </button>
                <button className="w-full border border-[#3C3C55] text-[#A0A0B0] py-2 px-4 rounded-lg hover:bg-[#3C3C55]/30 flex items-center justify-center transition-colors" 
                onClick={(e)=>{e.preventDefault(); navigate("/send-proposal")}}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send a proposal
                </button>
              </div>
            </div>

            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Received Requests</h3>
                <button className="flex ml-2 items-center text-[#00C3FF] hover:text-[#00C3FF]/80 text-sm font-medium" onClick={() => navigate("/requests/received")}>
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-1">
                {
                  loggedInUser?.connections?.received?.map((user, idx) => {
                    if (idx > 2) return null;
                    return (
                      <UserCard
                        user={user}
                        key={idx}
                        primaryAction={{ name: "Accept", action: (user) => handleAcceptRequest(user._id) }}
                        secondaryAction={{ name: "Reject", action: (user) => handleRejectRequest(user._id) }}
                      />
                    );
                  })
                }
                <p className='text-[#A0A0B0] text-sm m-2'>
                  {
                    !Array.isArray(loggedInUser?.connections?.received) || loggedInUser?.connections?.received?.length === 0
                      ? "No Request to Show"
                      : loggedInUser?.connections?.received?.length > 3
                        ? `${loggedInUser?.connections?.received?.length - 3} more...`
                        : ""
                  }
                </p>
              </div>
            </div>

            <div className="bg-[#252538] rounded-lg border border-[#3C3C55] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Sent Requests</h3>
                <button className="flex ml-2 items-center text-[#00C3FF] hover:text-[#00C3FF]/80 text-sm font-medium" onClick={() => navigate("/requests/sent")}>
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-1">
                {
                  loggedInUser?.connections?.sent?.map((user, idx) => {
                    if (idx > 2) return null;
                    return (
                      <UserCard
                        user={user}
                        key={idx}
                        primaryAction={{ name: "Withdraw", action: () => handleWithdrawRequest(user._id) }}
                        secondaryAction={{ name: "View Profile", action: () => handleViewProfile(user.userId) }}
                      />
                    );
                  })
                }
                <p className='text-[#A0A0B0] text-sm m-2'>
                  {
                    !Array.isArray(loggedInUser?.connections?.sent) || loggedInUser?.connections?.sent?.length === 0
                      ? "No Request to Show"
                      : loggedInUser?.connections?.sent?.length > 3
                        ? `${loggedInUser?.connections?.sent?.length - 3} more...`
                        : ""
                  }
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;