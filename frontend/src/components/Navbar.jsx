import { useState, useRef, useEffect } from 'react'
import Logo from "../assets/Logo.png";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import { logoutUser } from '../api/userApi';
import { logout } from '../../store/userSlice';
import { disconnectSocket } from '../../store/socketSlice';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentPage = location.pathname;
  const [notifications, setNotifications] = useState(1);

  const loggedInUser = useSelector(state => state.user)

  const handleNotificationClick = () => {}

  const handleMessageClick = () =>{
    if(!location.pathname.includes('/conversations'))
      navigate('/conversations')
  }

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target) && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const keyHandler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, []);

  const onProfileClick = () => {
    setOpen(prev => !prev);
  };

  const handleSignOut = async ()=>{
    try{
      const response = await logoutUser();
      if(response.status === 200){
        setOpen(false);
        
        dispatch(logout());
        dispatch(disconnectSocket());
        localStorage.setItem("logout", Date.now());
        localStorage.removeItem("logout");
        
        toast("Logged Out Successfully!")
        navigate('/login');
      }
    }catch(e){
      toast.error("Sign Out Failed");
    }
  }
  
  return (
    <nav className="bg-[#1E1E2F] border-b border-[#3C3C55] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <div className='flex items-center gap-8'>
          <Link to={'/dashboard'} >
            <img src={Logo} alt="SkillSwap Logo" className="h-16 w-auto" />
          </Link>

          {currentPage === '/dashboard' && (
            <div className="relative left">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
              <input
                type="text"
                placeholder="Search skills or users..."
                className="pl-10 text-white pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
              />
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleMessageClick}
            className="relative p-2 text-[#E0E0E0] hover:text-[#00C3FF] transition-colors"
          >
            <Mail />
          </button>

          <button
            onClick={handleNotificationClick}
            className="relative p-2 text-[#E0E0E0] hover:text-[#00C3FF] transition-colors"
          >
            <Bell className="w-6 h-6" />
            {notifications?.unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF5E5E] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.unread}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              ref={triggerRef}
              onClick={onProfileClick}
              className="flex items-center space-x-2"
            >
              <img
                src={loggedInUser?.profile?.profilePic}
                className='h-10 w-10 rounded-full overflow-hidden'
                alt={loggedInUser?.profile?.userName}
              />
              <span className="hidden md:block text-[#E0E0E0]">
                {loggedInUser?.profile?.userName}
              </span>
            </button>

            <div
              className={`absolute right-0 mt-2 w-44 bg-[#12121B] rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all z-50
                ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
              `}
            >
              <div className="py-1">
                <button
                  onClick={() => { setOpen(false); navigate('/profile'); }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-[#1F2A37] transition-colors"
                >
                  <User className='text-[#E0E0E0]'/>
                  <span className="text-sm text-[#E0E0E0]">Profile</span>
                </button>

                <button
                  onClick={() => { setOpen(false); navigate('/account'); }}
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-[#1F2A37] transition-colors"
                >
                <Settings className='text-[#E0E0E0]'/>
                  <span className="text-sm text-[#E0E0E0]">Account Settings</span>
                </button>

                <div className="border-t border-[#2A2A3A] my-1" />

                <button
                  onClick={ handleSignOut }
                  className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-[#1F2A37] transition-colors"
                >
                 <LogOut className='text-[#E0E0E0]'/>
                  <span className="text-sm text-[#E0E0E0]">Sign out</span>
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar;