import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import BlockedUserCard from "./BlockedUserCard";
import { getBlockedUsers } from '../../api/userApi';
import useConnectionHandlers from '../../hooks/useConnectionHanlders';

const BlockedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);

//   const {getUser} = useConnectionHandlers();
  useEffect(() => {
    const getBlockedUsersData = async () =>{
        const response = await getBlockedUsers();
        if(response.status === 200){
            console.log(response.data)
            setBlockedUsers(response.data.blocked)
            setLoading(false);
        }
    }
    getBlockedUsersData();
    }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-[#252538] w-[70%] mx-auto my-4 rounded-lg border border-[#3C3C55] p-6">
      <div className="flex items-center justify-between my-2 flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-[#E0E0E0] ml-2">
          {blockedUsers.length || 0} Blocked Users
        </h2>
      </div>

      <div className="space-y-4">
        {blockedUsers.map(user => (
          <BlockedUserCard key={user?._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default BlockedUsers;
