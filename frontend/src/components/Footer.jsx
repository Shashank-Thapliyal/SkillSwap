import Logo from "../assets/Logo.png";

const Footer = () => {
  return (
   <footer className="bg-[#1E1E2F] border-t border-[#3C3C55] py-8 px-6">

  {/* Container for logo + tagline */}
  <div className="max-w-6xl mx-auto text-center">
    <img 
      src={Logo}
      alt="SkillSwap Logo"
      className="mx-auto max-w-[120px] h-auto"
    />

    <p className="text-[#A0A0B0] text-sm mt-2">
      Connecting learners worldwide through skill exchange.
    </p>
  </div>

  {/* Full-width line */}
  <div className="border-t border-[#3C3C55] mt-8 w-full"></div>

  {/* Copyright */}
  <div className="text-center text-[#A0A0B0] text-sm mt-8">
    <p>&copy; 2025 SkillSwap. All rights reserved.</p>
  </div>
</footer>

  );
};

export default Footer;
