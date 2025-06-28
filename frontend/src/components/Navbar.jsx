import React, { useState } from 'react'
import Logo from "../assets/Logo.png";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const currentPage = location.pathname;
    const [notifications, setNotifications] = useState(1); 

    const loggedInUser = useSelector(state => state.user)
    // console.log("loggedInUser in Navbar: ", loggedInUser)
    const handleNotificationClick = () => {

    }


    const onProfileClick = () => {

    }
  return (
 <nav className="bg-[#1E1E2F] border-b border-[#3C3C55] px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between">

    <div className='flex items-center gap-8'>
      <img src={Logo} alt="SkillSwap Logo" className="h-16 w-auto" />
      
      {
        currentPage === '/dashboard' && <div className="relative left">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
        <input
          type="text"
          placeholder="Search skills or users..."
          className="pl-10 text-white pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent w-64"
        />
      </div>
      }
    </div>
      {/* <div className="hidden md:flex items-center space-x-8 text-zinc-200">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/matches">Find Matches</Link>
        <Link to="/sessions">Sessions</Link>
        <Link to="/community">Community</Link>
        <Link to="/messages">Messages</Link>
      </div> */}
      
      <div className="flex items-center space-x-4">
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
        
        <div className="relative">
          <button onClick={onProfileClick} className="flex items-center space-x-2">
            <img src={loggedInUser?.profile?.profilePic} className='h-10 w-10 rounded-full overflow-hidden' alt={loggedInUser?.profile?.userName} />
            <span className="hidden md:block text-[#E0E0E0]">{loggedInUser?.profile?.userName}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar