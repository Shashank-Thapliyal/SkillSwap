import {OutlineButton, PrimaryButton} from "../components/Buttons.jsx"

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm backdrop-saturate-150 bg-white/10">
      <div className="bg-[#1E1E2F] p-6 rounded-2xl shadow-2xl max-w-md w-full border border-white/20 text-white">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-[#CCCCCC]">{message}</p>
        <div className="flex justify-end gap-4">
          <OutlineButton onClick={onCancel} className="px-4 py-2 rounded border border-gray-400 text-gray-300">
            Cancel
          </OutlineButton>
          <PrimaryButton onClick={onConfirm} className="px-4 py-2 rounded bg-red-400 hover:bg-red-500">
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;