export const PrimaryButton = ({ children, onClick, disabled = false, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 bg-[#00C3FF] hover:bg-[#009EDB] text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, disabled = false, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 bg-[#00F2B2] hover:bg-[#00C696] text-black font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const OutlineButton = ({ children, onClick, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-6 py-3 border border-[#3C3C55] text-[#E0E0E0] hover:border-[#00C3FF] hover:text-[#00C3FF] font-semibold rounded-lg transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);
