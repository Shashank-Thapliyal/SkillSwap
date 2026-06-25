import { useState, useEffect } from "react";
import { OutlineButton, PrimaryButton } from "../components/Buttons.jsx";

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, slots }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Default to the first slot when the modal opens, but allow changes
  useEffect(() => {
    if (isOpen && slots?.length > 0) {
      setSelectedSlot(slots[0]);
    }
  }, [isOpen, slots]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-saturate-150 bg-white/10">
      <div className="bg-[#1E1E2F] p-6 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 text-white">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4 text-[#CCCCCC]">{message}</p>

        {/* Dynamic Time Slot Selector */}
        {slots && slots.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-sm font-medium text-gray-300">Select a time slot:</p>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
              {slots.map((slot, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSlot === slot
                      ? "border-[#00C3FF] bg-[#00C3FF]/10" 
                      : "border-[#3C3C55] bg-[#252536] hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={selectedSlot === slot}
                    onChange={() => setSelectedSlot(slot)}
                    className="w-4 h-4 text-[#00C3FF] bg-gray-700 border-gray-600 focus:ring-[#00C3FF]"
                  />
                  <span className="text-sm">{new Date(slot).toLocaleString()}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4 mt-2">
          <OutlineButton onClick={onCancel} className="px-4 py-2 rounded border border-gray-400 text-gray-300">
            Cancel
          </OutlineButton>
          <PrimaryButton 
            onClick={() => onConfirm(selectedSlot)} 
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={slots?.length > 0 && !selectedSlot}
          >
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;