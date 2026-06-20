import { WifiOff } from "lucide-react";

const NoInternet = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4 font-semibold text-white">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <WifiOff size={72} className="text-error" />
        </div>

        <h1 className="text-3xl font-bold mb-3">
          No Internet Connection
        </h1>

        <p className="text-base-content/70 mb-6">
          Please check your internet connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default NoInternet;