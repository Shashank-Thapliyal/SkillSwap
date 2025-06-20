import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Logo from "../../assets/Logo.png";
import { PrimaryButton } from "../../components/Buttons.jsx";
import useSignup from "./useSignup.js";


const SignUp = () => {
  const {
    formData: {
      firstName, middleName, lastName, email, userName, password,
      confirmPassword, gender, dob, isPasswordVisible
    },
    setFormData: {
      setFirstName, setMiddleName, setLastName, setEmail, setUserName,
      setPassword, setConfirmPassword, setGender, setDob, setIsPasswordVisible
    },
    onSignUp
  } = useSignup();


    return (
        <div className="min-h-screen bg-[#1E1E2F] flex items-center justify-center px-4">
            <div className="w-full max-w-md md:max-w-[50%] md:w-[40%] p-5 box-border shadow-2xl rounded-2xl">
                <div className="text-center mb-8">
                    <img src={Logo} alt="SkillSwap Logo" className="h-20 w-auto mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Join SkillSwap</h1>
                    <p className="text-[#A0A0B0]">Start your skill exchange journey today</p>
                </div>
                <form className="space-y-6 grid grid-cols-6 gap-4 p-6">
                    <div className="col-span-6 md:col-span-2 relative">
                        <input
                            required
                            type="text"
                            value={firstName}
                            placeholder="First Name"
                            onChange={(e) => setFirstName(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>

                    <div className="col-span-6 md:col-span-2">
                        <input
                            type="text"
                            value={middleName}
                            placeholder="Middle Name"
                            onChange={(e) => setMiddleName(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                    </div>

                    <div className="col-span-6 md:col-span-2">
                        <input
                            type="text"
                            value={lastName}
                            placeholder="Last Name"
                            onChange={(e) => setLastName(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                    </div>

                    <div className="col-span-6 md:col-span-3 relative">
                        <input
                            required
                            type="text"
                            value={userName}
                            placeholder="Username"
                            onChange={(e) => setUserName(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>

                    <div className="col-span-6 md:col-span-3 relative">
                        <input
                            required
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>

                    <div className="col-span-6 md:col-span-3 relative">
                        <input
                            required
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />

                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>

                    <div className="col-span-6 md:col-span-3 relative">
                        <input
                            required
                            type={isPasswordVisible ? "text" : "password"}
                            value={confirmPassword}
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value.trim())}
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                        />
                        {isPasswordVisible ?
                            <EyeOff className="absolute z-10 right-4 top-[25%] text-white" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                            : <Eye className="absolute z-10 right-4 top-[25%] text-white" onClick={() => setIsPasswordVisible(!isPasswordVisible)} />
                        }
                    </div>



                    <div className="col-span-6 md:col-span-3 relative">
                        <label className="block mb-1 text-[#A0A0B0] text-sm font-medium">Gender</label>
                        <select
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Others</option>
                        </select>
                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>
                    <div className="col-span-6 md:col-span-3 relative">
                        <label className="block mb-1 text-[#A0A0B0] text-sm font-medium">Date of Birth</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-[#2A2A40] border border-[#3C3C55] rounded-lg text-[#E0E0E0] placeholder-[#A0A0B0] focus:border-[#00C3FF] focus:ring-1 focus:ring-[#00C3FF] focus:outline-none"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <p className="h-2 text-2xl text-red-700 px-2 absolute top-0 right-0">*</p>
                    </div>

                    <div className="flex items-start col-span-6 ">
                        <input type="checkbox" className="mt-1 mr-3" required />
                        <span className="text-sm text-[#A0A0B0]">
                            I agree to the{' '}
                            <p className="text-[#00C3FF] inline hover:underline">Terms of Service</p>
                            {' '}and{' '}
                            <p className="text-[#00C3FF] inline hover:underline">Privacy Policy</p>
                        </span>
                    </div>

                    <PrimaryButton onClick={onSignUp} className="w-full col-span-6">
                        Create Account
                    </PrimaryButton>
                </form>


                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#3C3C55]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#252538] text-[#A0A0B0]">Or continue with</span>
                        </div>
                    </div>

                    <button

                        className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-[#3C3C55] rounded-lg text-[#E0E0E0] hover:border-[#00C3FF] transition-colors"
                    >
                        <img src="../assets/Logo.png" alt="Google" className="w-5 h-5 mr-3" />
                        Continue with Google
                    </button>
                </div>

                <p className="mt-8 text-center text-sm text-[#A0A0B0]">
                    Already have an account?{' '}
                    <Link to={"/login"} className="text-[#00C3FF] hover:underline">Log In</Link>
                </p>

            </div>
        </div>
    )
}


export default SignUp