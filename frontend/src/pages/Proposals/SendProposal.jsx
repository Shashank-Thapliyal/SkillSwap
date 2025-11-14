import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserData } from '../../api/userApi';
import { MapPin } from 'lucide-react';
import Loader from '../../components/Loader';
import { sendProposalReq, cancelProposalRequest, getSentProposals } from "../../api/proposalApi.js"
import ProposalCard from './ProposalCard.jsx';
import ProposalModal from './ProposalModal.jsx';

const SendProposal = () => {
  const { receiverId } = useParams();
  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState([]);
  const [loadingProposals, setLoadingProposals] = useState(true);

  const [receiverInfo, setReceiverInfo] = useState(null);
  const [message, setMessage] = useState('I wish to learn react from you');
  const [timeSlots, setTimeSlots] = useState(['']);
  const [paymentType, setPaymentType] = useState('free');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAllProposals, setShowAllProposals] = useState(false);

  const fetchProposals = async () => {
    try {
      const response = await getSentProposals(receiverId);
      if (response.status === 200) {
        const sorted = [...response.data?.proposals].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProposals(sorted);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch proposals");
    } finally {
      setLoadingProposals(false);
    }
  };
  

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const response = await getUserData(receiverId);
        setReceiverInfo(response.data.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user Informmation");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
    fetchProposals();
  }, [receiverId]);


  const handleTimeSlotChange = (index, value) => {
    const updated = [...timeSlots];
    updated[index] = value;
    setTimeSlots(updated);
  };

  const addSlot = () => setTimeSlots([...timeSlots, '']);
  const removeSlot = (index) =>
    setTimeSlots(timeSlots.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || timeSlots.some(slot => !slot)) {
      toast.error("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        message, timeSlots, paymentType
      }
      console.log("data", data);
      const response = await sendProposalReq(receiverId, data);
      console.log("response", response);
      if (response.status === 200) {
        toast.success("Proposal Sent Successfully");
      }
      // toast.success(res.data.message);
      setMessage('');
      setTimeSlots(['']);
      setPaymentType('free');
    } catch (err) {
      toast.error("Failed to send, retry after some time");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />
  }

  const handleCancelProposal = async (proposalId) => {
    try {
      const response = await cancelProposalRequest(proposalId);
      if (response.status === 200) {
        toast.success("Proposal cancelled");
        await fetchProposals();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel proposal");
    }
  };



  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-[#1E1E2F] rounded-lg border border-[#3C3C55] shadow-lg">
      {/* Header - Receiver Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={receiverInfo?.profile?.profilePic}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border border-[#3C3C55]"
        />
        <div>
          <h3 className="text-2xl text-white font-bold">
            {receiverInfo?.profile?.firstName} {receiverInfo?.profile?.lastName}
          </h3>
          <p className="text-[#A0A0B0] text-sm my-1 flex gap-2 items-center"> {<MapPin size={14} />} {`  ${receiverInfo?.profile?.location}` || "Unknown Location"}</p>
          <p className="text-[#A0A0B0] text-sm">{receiverInfo?.profile?.about || "No bio provided"}</p>
        </div>
      </div>
   

      <h2 className="text-xl text-white font-semibold my-4 mt-6">Send Proposal to {receiverInfo?.profile?.firstName}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[#E0E0E0] block mb-2">Message</label>
          <textarea

            className="w-full resize-none bg-[#2C2C3E] text-white p-3 rounded-md focus:outline-none  focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] "
            rows="4"
            placeholder="Write a brief proposal message... "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[#E0E0E0] block mb-2">Proposed Time Slots</label>
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex gap-3 mb-2">
              <input
                type="datetime-local"
                value={slot}
                onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                className="bg-[#2C2C3E] text-white p-2 rounded-md w-full focus:outline-none  focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] "
              />
              {timeSlots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSlot}
            className="text-sm text-blue-400 hover:underline mt-1"
          >
            + Add another time slot
          </button>
        </div>

        <div>
          <label className="text-[#E0E0E0] block mb-2">Payment Type</label>
          <select
            className="w-full bg-[#2C2C3E] text-white p-2 rounded-md focus:outline-none"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <option value="free">Free</option>
            <option value="swap">Swap</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 mt-4 rounded-md text-white font-semibold ${isSubmitting ? 'bg-[#3A3A50]' : 'bg-[#00C2FF] hover:bg-[#00B2F0]'
            }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Proposal'}
        </button>
      </form>

         {loadingProposals ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <p className="text-white mt-10 text-center">No proposals sent yet.</p>
      ) : (
        <div className="mt-10 space-y-6 relative">
          <h3 className="text-white text-lg font-semibold">Your Sent Proposals</h3>


          <button
            className="absolute right-0 top-0 text-sm text-blue-400 hover:underline"
            onClick={() => setShowAllProposals(true)}
          >
            View All&nbsp; &gt;
          </button>

          {proposals.slice(0, 2).map((proposal) => (
            <ProposalCard key={proposal._id} proposal={proposal} onCancel={handleCancelProposal} />
          ))}
        </div>


      )}
      {showAllProposals && (
        <ProposalModal
          proposals={proposals}
          onCancel={handleCancelProposal}
          onClose={() => setShowAllProposals(false)}
        />
      )}
    </div>
  );
};

export default SendProposal;
