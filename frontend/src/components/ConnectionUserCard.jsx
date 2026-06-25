import { EllipsisVertical, MapPin } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { PrimaryButton } from './Buttons';
import { toast } from 'react-toastify';
import { blockUser } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

const ConnectionUserCard = ({ user, confirmRemove, confirmBlock }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  const navigate = useNavigate()

  const handleRemove = () => {
    setModalType("remove");
    setShowConfirmModal(true);
    setShowDropdown(false);
  };

  const handleBlock = () => {
    setModalType("block");
    setShowConfirmModal(true);
    setShowDropdown(false);
  };

  const handleConfirmBlock = ()=>{
    confirmBlock(user._id);
    setShowConfirmModal(false);
    setShowDropdown(false);
  }

  const handleConfirmRemove = ()=>{
    confirmRemove(user._id);
    setShowConfirmModal(false);
    setShowDropdown(false);
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideModal = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowConfirmModal(false);
      }
    };

    if (showConfirmModal) {
      document.addEventListener('mousedown', handleClickOutsideModal);
      return () => document.removeEventListener('mousedown', handleClickOutsideModal);
    }
  }, [showConfirmModal]);

  return (
    <>
      <div className="relative bg-[#1E1E2F] p-6 rounded-lg border border-[#3C3C55] flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <img
            src={user?.profile?.profilePic}
            alt={`${user?.profile?.firstName} ${user?.profile?.lastName}`}
            className="w-16 h-16 rounded-full object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <h3 className="hover:cursor-pointer text-[#E0E0E0] text-lg font-medium mb-1" onClick={()=>navigate(`/profile/${user._id}`)}>
                {user.profile.firstName} {user.profile.lastName}
              </h3>

              {user?.profile?.location && (
                <div className="flex items-center gap-1 mb-2">
                  <MapPin size={14} className="text-[#A0A0B0]" />
                  <span className="text-[#A0A0B0] text-sm">{user.profile.location}</span>
                </div>
              )}

              {user?.profile?.about && (
                <p className="text-[#A0A0B0] text-sm leading-relaxed mb-3 break-words">
                  {user.profile.about}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[#E0E0E0] text-sm font-medium">Can teach: </span>
                <div className="mt-1">
                  {user?.skills?.canTeach?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.canTeach.map(skill => (
                        <span
                          key={skill._id}
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#A0A0B0] text-xs">No skills listed</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[#E0E0E0] text-sm font-medium">Wants to learn : </span>
                <div className="mt-1">
                  {user?.skills?.wantToLearn?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.wantToLearn.map(skill => (
                        <span
                          key={skill._id}
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[#A0A0B0] text-xs">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 ml-4 flex-shrink-0">
          <PrimaryButton
            className={`text-sm whitespace-nowrap transition-opacity ${showDropdown ? 'pointer-events-none opacity-60' : ''}`}
            onClick={()=>navigate(`/send-proposal/${user._id}`)}
          >
            Send Proposal
          </PrimaryButton>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(prev => !prev)}
              className="text-[#E0E0E0] hover:text-white p-1"
            >
              <EllipsisVertical size={20} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-[#2C2C3E] border border-[#3C3C55] rounded shadow-lg z-10">
                <button
                  onClick={handleRemove}
                  className="block w-full text-left px-4 py-2 text-sm text-[#E0E0E0] hover:bg-[#3C3C55]"
                >
                  Remove Connection
                </button>
                <button
                  onClick={handleBlock}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3C3C55]"
                >
                  Block User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        title={modalType === "remove" ? "Confirm Remove" : "Confirm Block"}
        message={
          modalType === "remove"
            ? "Are you sure you want to remove this connection?"
            : "Are you sure you want to block this user?"
        }
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={modalType === "remove" ?  handleConfirmRemove : handleConfirmBlock}
      />
    </>
  );
};

export default ConnectionUserCard;