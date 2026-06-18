import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";

import { getUserData } from "../../api/userApi";
import { sendProposalReq } from "../../api/proposalApi";

import Loader from "../../components/Loader";
import ProposalCard from "./ProposalCard";
import ProposalModal from "./ProposalModal";

import useProposals from "./useProposals.js";

const SendProposal = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [receiverInfo, setReceiverInfo] = useState(null);

  const [message, setMessage] = useState("I wish to learn react from you");
  const [timeSlots, setTimeSlots] = useState([""]);
  const [paymentType, setPaymentType] = useState("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllProposals, setShowAllProposals] = useState(false);

  const {
    proposals,
    loadingProposals,
    fetchSentProposals,
    cancelProposal,
  } = useProposals({ receiverId });

  useEffect(() => {
    const fetchReceiver = async () => {
      try {
        const response = await getUserData(receiverId);
        setReceiverInfo(response.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiver();
    fetchSentProposals();
  }, [receiverId]);

  const handleTimeSlotChange = (index, value) => {
    const updated = [...timeSlots];
    updated[index] = value;
    setTimeSlots(updated);
  };

  const addSlot = () => setTimeSlots([...timeSlots, ""]);
  const removeSlot = (index) =>
    setTimeSlots(timeSlots.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || timeSlots.some((slot) => !slot)) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = { message, timeSlots, paymentType };
      const response = await sendProposalReq(receiverId, data);

      if (response.status === 201) {
        toast.success("Proposal sent successfully");
        fetchSentProposals();
        setMessage("");
        setTimeSlots([""]);
        setPaymentType("free");
        navigate(`/conversations/${receiverId}/proposals`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-[#1E1E2F] rounded-lg border border-[#3C3C55] shadow-lg">
      {/* Receiver Info */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={receiverInfo?.profile?.profilePic}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border border-[#3C3C55]"
        />
        <div>
          <h3 className="text-2xl text-white font-bold">
            {receiverInfo?.profile?.firstName}{" "}
            {receiverInfo?.profile?.lastName}
          </h3>
          <p className="text-[#A0A0B0] text-sm flex gap-2 items-center">
            <MapPin size={14} />
            {receiverInfo?.profile?.location || "Unknown location"}
          </p>
          <p className="text-[#A0A0B0] text-sm">
            {receiverInfo?.profile?.about || "No bio provided"}
          </p>
        </div>
      </div>

      <h2 className="text-xl text-white font-semibold mb-4">
        Send Proposal
      </h2>

      {/* Proposal Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          className="w-full bg-[#2C2C3E] text-white p-3 rounded-md resize-none"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) =>
                handleTimeSlotChange(index, e.target.value)
              }
              className="w-full bg-[#2C2C3E] text-white p-2 rounded-md"
            />
            {timeSlots.length > 1 && (
              <button
                type="button"
                onClick={() => removeSlot(index)}
                className="text-red-400"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addSlot}
          className="text-blue-400 text-sm"
        >
          + Add another slot
        </button>

        <select
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          className="w-full bg-[#2C2C3E] text-white p-2 rounded-md"
        >
          <option value="free">Free</option>
          <option value="swap">Swap</option>
          <option value="paid">Paid</option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#00C2FF] py-2 rounded-md text-white"
        >
          {isSubmitting ? "Sending..." : "Send Proposal"}
        </button>
      </form>

      {/* Sent Proposals */}
      {loadingProposals ? (
        <Loader />
      ) : proposals.length === 0 ? (
        <p className="text-white mt-6 text-center">
          No proposals sent yet
        </p>
      ) : (
        <div className="mt-10 space-y-4 relative">
          <h3 className="text-white font-semibold">Your Sent Proposals</h3>

          <button
            className="absolute right-0 top-0 text-blue-400 text-sm"
            onClick={() => setShowAllProposals(true)}
          >
            View All →
          </button>

          {proposals.slice(0, 2).map((proposal) => (
            <ProposalCard
              key={proposal._id}
              proposal={proposal}
              onCancel={cancelProposal}
            />
          ))}

          {proposals.length > 2 && (
            <p className="text-sm text-white">
              {proposals.length - 2} more...
            </p>
          )}
        </div>
      )}

      {showAllProposals && (
        <ProposalModal
          proposals={proposals}
          onCancel={cancelProposal}
          onClose={() => setShowAllProposals(false)}
        />
      )}
    </div>
  );
};

export default SendProposal;