import { useEffect, useState } from "react";
import Logo from "../../assets/Logo.png";
import { Link, useNavigate } from 'react-router-dom'
import { PrimaryButton } from "../../components/Buttons.jsx";
import { loginUser } from "../../api/authApi.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/userSlice.js";

const LogIn = () => {
  const [userDetails, setUserDetails] = useState({
    email: "sneha@gmail.com",
    password: "Sneha@123"
  });

  const [disableSubmit, setDisableSubmit] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userData = { email: userDetails.email, password: userDetails.password }

      const res = await loginUser(userData);
      if (res?.status === 200) {
        toast.success("Logged In Successfully");
        console.log("login: ", res.data.user);
        dispatch(setUser(res.data.user))
        navigate("/profile");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const { email, password } = userDetails;
    const isFormValid = email.trim() !== "" && password.trim() !== "";
    setDisableSubmit(!isFormValid);
  }, [userDetails]);

  return (
    <div className="min-h-screen bg-[#1E1E2F] flex items-center justify-center px-4">
      <div className="max-w-md w-full md:max-w-[50%] md:w-[40%] p-5 box-border shadow-2xl rounded-2xl">
        <div>
          <div className="py-8">
            <div className="text-center mb-8">
              <img src={Logo} alt="skillswap" className="h-20 w-auto mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-[#A0A0B0]">Sign in to continue your learning journey</p>
            </div>

            <form className="space-y-6 w-[85%] m-auto">

              <div className="grid grid-cols-1 gap-3 my-0.5">
                <div className="col-span-1">
                  <input
                    required
                    type="email"
                    value={userDetails.email}
                    placeholder="email"
                    onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value.trim() }))}
                    className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                  />
                </div>

                <div className="col-span-1">
                  <input
                    required
                    type="password"
                    value={userDetails.password}
                    placeholder="password"
                    onChange={(e) => setUserDetails(prev => ({ ...prev, password: e.target.value.trim() }))}
                    className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                  />
                </div>

              </div>

              <div className="flex items-center justify-between m-0">
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="text-sm text-[#00C3FF] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <PrimaryButton disabled={disableSubmit} onClick={handleLogin} className="w-full mt-2">
                Sign In
              </PrimaryButton>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3C3C55]"></div>
                </div>
                {/* <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#252538] text-[#A0A0B0]">Or continue with</span>
                </div> */}
              </div>

              {/* <button
                // onClick={onGoogleLogin}
                className="mt-4 w-[85%] m-auto flex items-center justify-center px-4 py-3 border border-[#3C3C55] rounded-lg text-[#E0E0E0] hover:border-[#00C3FF] transition-colors"
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-3" />
                Continue with Google
              </button> */}
            </div>

            <p className="mt-8 text-center text-sm text-[#A0A0B0]">
              Don't have an account?{' '}

              <Link to="/signup" className="text-[#00C3FF] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogIn