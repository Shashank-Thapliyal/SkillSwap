import React from 'react'
import Logo from "../assets/Logo.png";
import { OutlineButton, PrimaryButton, SecondaryButton } from "../components/Buttons.jsx"
import Footer from '../components/Footer.jsx';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1E1E2F]">
      {/* Header */}
      <header className="bg-[#1E1E2F] mt-0 border-b border-[#3C3C55] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img src={Logo} alt="SkillSwap Logo" className="h-20 w-auto" />

          <div className="flex space-x-4">
            <OutlineButton onClick={() => navigate("/login")}>Log In</OutlineButton>
            <PrimaryButton onClick={() => navigate("/signup")}>Sign Up</PrimaryButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Exchange Skills, <span className="text-[#00C3FF]">Build Connections</span>
          </h1>
          <p className="text-xl text-[#A0A0B0] mb-8">
            Connect with learners and experts worldwide. Teach what you know, learn what you need.
          </p>
          <div className="flex justify-center space-x-4">
            <PrimaryButton onClick={()=>navigate("/signup")} className="text-lg px-8 py-4">
              Start Learning Today
            </PrimaryButton>
            <SecondaryButton className="text-lg px-8 py-4">
              Browse Skills
            </SecondaryButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#252538]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose SkillSwap?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3

                // ============================================================================
                // SKILLSWAP COMPONENT LIBRARY CONTINUATION
                // ============================================================================

                // CONTINUING FROM WHERE THE PREVIOUS FILE ENDED...
                className="text-xl font-semibold text-white mb-2">Skill Exchange</h3>
              <p className="text-[#A0A0B0]">
                Trade your expertise for new knowledge in a fair, balanced way.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-white mb-2">Global Community</h3>
              <p className="text-[#A0A0B0]">
                Connect with learners and teachers from around the world.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">Flexible Learning</h3>
              <p className="text-[#A0A0B0]">
                Learn at your own pace with video calls, in-person, or hybrid sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00C3FF] rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-white mb-2">Create Profile</h4>
              <p className="text-[#A0A0B0] text-sm">
                Set up your profile with skills you can teach and want to learn.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00C3FF] rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-white mb-2">Find Matches</h4>
              <p className="text-[#A0A0B0] text-sm">
                Discover users who can teach what you want to learn and vice versa.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00C3FF] rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-white mb-2">Exchange Skills</h4>
              <p className="text-[#A0A0B0] text-sm">
                Schedule sessions and start learning from each other.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#00C3FF] rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-white mb-2">Grow Together</h4>
              <p className="text-[#A0A0B0] text-sm">
                Build your skills, expand your network, and help others grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-[#252538]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-[#A0A0B0] mb-8">
            Join thousands of learners already exchanging skills on SkillSwap.
          </p>
          <PrimaryButton onClick={()=> navigate('/signup')} className="text-lg px-8 py-4">
            Get Started Free
          </PrimaryButton>
        </div>
      </section>

      {/* Footer */}
    <Footer />
    </div>
  )
}

export default LandingPage