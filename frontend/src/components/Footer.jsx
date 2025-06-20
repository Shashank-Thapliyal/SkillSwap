import Logo from "../assets/Logo.png";

const Footer = () => {
    return (
              <footer className="bg-[#1E1E2F] border-t border-[#3C3C55] py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div height="200px" width="200px">

                <img src={Logo} alt="SkillSwap Logo" className="max-w-[120px] h-auto" />
              </div>
              <p className="text-[#A0A0B0] text-sm mt-2">
                Connecting learners worldwide through skill exchange.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Platform</h5>
              <ul className="space-y-2 text-sm text-[#A0A0B0]">
                <li><a href="#" className="hover:text-white">How it works</a></li>
                <li><a href="#" className="hover:text-white">Browse skills</a></li>
                <li><a href="#" className="hover:text-white">Success stories</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-[#A0A0B0]">
                <li><a href="#" className="hover:text-white">Help center</a></li>
                <li><a href="#" className="hover:text-white">Contact us</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Legal</h5>
              <ul className="space-y-2 text-sm text-[#A0A0B0]">
                <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of service</a></li>
                <li><a href="#" className="hover:text-white">Cookie policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#3C3C55] mt-8 pt-8 text-center text-[#A0A0B0] text-sm">
            <p>&copy; 2024 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer