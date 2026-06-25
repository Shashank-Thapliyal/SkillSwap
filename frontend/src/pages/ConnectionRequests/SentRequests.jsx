import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton } from '../../components/Buttons';
import { EllipsisVertical, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../store/userSlice';
import Loader from '../../components/Loader';
import useConnectionHandlers from '../../hooks/useConnectionHanlders';
import RequestUserCard from './RequestUserCard';

const SentRequests = () => {
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState([]);

  const loggedInUser = useSelector(state => state.user);
  const { handleWithdrawRequest } = useConnectionHandlers();

  useEffect(() => {
    if (loggedInUser?.connections?.sent) {
      setSentRequests(loggedInUser?.connections?.sent);
      setLoading(false);
    }
  }, [loggedInUser]);

  const onBlocked = (userId) => {
    setLoading(true);
    setSentRequests( sentRequests.filter( req => req.userId !== userId) )
    setLoading(false);
  }
  if (loading) return <Loader />;

  return (
    <div className="bg-[#252538] w-[70%] mx-auto my-4 rounded-lg border border-[#3C3C55] p-6">
      <div className="flex items-center justify-between my-2 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-[#E0E0E0] ml-2">
          {sentRequests.length} Sent Request{sentRequests.length !== 1 && 's'}
        </h2>

        <div className="flex items-center gap-4">
          <label htmlFor="sortSelect" className="text-[#E0E0E0]">Sort By:</label>
          <select
            id="sortSelect"
            className="bg-[#1E1E2F] text-[#A0A0B0] px-3 py-2 rounded-md"
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>

          <input
            type="text"
            placeholder="Search people..."
            className="bg-[#1E1E2F] text-[#E0E0E0] px-3 py-2 rounded-md w-48 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {sentRequests?.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center border border-[#3C3C55] rounded-lg bg-[#1E1E2F]">
            <Inbox className="w-10 h-10 text-[#A0A0B0] mb-3" />
            <h2 className="text-[#E0E0E0] text-lg font-semibold mb-2">No Sent Requests</h2>
            <p className="text-[#A0A0B0] text-sm max-w-md">
              You haven’t sent any requests yet. Once you request to learn from someone, their profile will appear here.
            </p>
          </div>
        ) : (
          sentRequests?.map(conn => (
            <RequestUserCard
              key={conn._id}
              user={conn}
              primaryAction={{
                name: 'Withdraw',
                onClick: handleWithdrawRequest
              }}
              onBlocked={onBlocked}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SentRequests;
