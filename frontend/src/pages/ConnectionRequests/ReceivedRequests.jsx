import React, { useState, useEffect, useRef } from 'react';
import { PrimaryButton } from '../../components/Buttons';
import { EllipsisVertical, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import useConnectionHandlers from '../../hooks/useConnectionHanlders';
import RequestUserCard from './RequestUserCard';

const ReceivedRequests = () => {
  const [loading, setLoading] = useState(true);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const loggedInUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleAcceptRequest, handleRejectRequest } = useConnectionHandlers();
  const dropdownRef = useRef();

  useEffect(() => {
    if (loggedInUser?.connections?.received) {
      setReceivedRequests(loggedInUser?.connections?.received);
      setLoading(false);
    }
  }, [loggedInUser]);

  const onBlocked = (userId) => {
    setLoading(true);
    setReceivedRequests(prev => prev.filter(req => req.userId !== userId));
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#252538] w-[70%] mx-auto my-4 rounded-lg border border-[#3C3C55] p-6">
      <div className="flex items-center justify-between my-2 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-[#E0E0E0] ml-2">
          {receivedRequests.length} Request{receivedRequests.length !== 1 && 's'} Received
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
        {receivedRequests.length === 0 ? (
          <div className="w-full py-12 flex flex-col items-center justify-center text-center border border-[#3C3C55] rounded-lg bg-[#1E1E2F]">
            <Inbox className="w-10 h-10 text-[#A0A0B0] mb-3" />
            <h2 className="text-[#E0E0E0] text-lg font-semibold mb-2">No Requests Received</h2>
            <p className="text-[#A0A0B0] text-sm max-w-md">
              Once someone requests to learn from you, their request will be listed here for you to review and respond to.
            </p>
          </div>
        ) : (
          receivedRequests.map(conn => (
            <RequestUserCard
              key={conn._id}
              user={conn}
              primaryAction={{
                name: 'Accept',
                onClick: handleAcceptRequest
              }}
              secondaryAction={{
                name: 'Reject',
                onClick: handleRejectRequest
              }}
              onBlocked={onBlocked}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReceivedRequests;
