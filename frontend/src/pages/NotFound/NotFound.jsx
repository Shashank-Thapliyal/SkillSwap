import { useNavigate } from "react-router-dom";
import { PrimaryButton } from "../../components/Buttons";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <p className="text-[#00C3FF] text-2xl mb-3">
                    Error 404
                </p>

                <h1 className="text-5xl md:text-7xl font-bold text-white whitespace-nowrap">
                    Page Not Found
                </h1>

                <p className="mt-5 text-gray-400 leading-relaxed">
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                <PrimaryButton className='border-e-black border-2'
                    onClick={() => navigate("/")}
                    className="mt-8"
                >
                    Return Home
                </PrimaryButton>
            </div>
        </div>
    );
}