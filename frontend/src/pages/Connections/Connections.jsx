import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader  from '../../components/Loader.jsx';import ConnectionUserCard from '../../components/ConnectionUserCard.jsx';
import useConnectionHandlers from '../../hooks/useConnectionHanlders.js';
import { toast } from 'react-toastify';
import { removeConnection } from '../../api/requestApi.js';
import { blockUser } from '../../api/userApi.js';

const Connections = () => {
    const loggedInUser = useSelector(state => state.user)

    const [user, setUser] = useState(loggedInUser);
    const [loading, setLoading] = useState(true);
    const [connections, setConnections] = useState([])

    const {getUser} = useConnectionHandlers();

    useEffect( ()=>{
        setLoading(true)
        setUser(loggedInUser);
        setConnections(loggedInUser?.connections?.current);
        setLoading(false);
    }, [loggedInUser?.connections?.current, loggedInUser])

    const confirmRemove = async (userId) => {
        try {
            setLoading(true);
            console.log("confirm remove", userId)
            const response = await removeConnection(userId);
            if(response.status === 200){
                await getUser();
                setLoading(false);
                toast.success("Connection Removed Successfully")

            }
        } catch (error) {
            console.log(error);
            toast.error("Error Removing Connection")
        }
      };
    
      const confirmBlock = async (userId) => {
        try {
            setLoading(true);
          const response = await blockUser(userId);
          if(response.status === 200) {
            await getUser();
            toast.success("User blocked successfully");
            setLoading(false);
          }
        } catch (error) {
            console.log(error);
          toast.error("Error blocking user");
        }
      };

      if(loading)
        return <Loader />

console.log(connections?.map( con => console.log(con)))
    return (
        <div className="bg-[#252538] w-[70%] mx-auto my-4 rounded-lg border border-[#3C3C55] p-6">
            <div className="flex items-center justify-between my-2 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold text-[#E0E0E0] ml-2">{user?.connectionsCount} Connections</h2>

                <div className="flex items-center gap-4">
                    <label htmlFor="sortSelect" className="text-[#E0E0E0]">Sort By:</label>
                    <select
                        id="sortSelect"
                        className="bg-[#1E1E2F] text-[#A0A0B0] px-3 py-2 rounded-md"
                    >
                        <option value="firstName">First Name</option>
                        <option value="lastName">Last Name</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search a connection..."
                        className="bg-[#1E1E2F] text-[#E0E0E0] px-3 py-2 rounded-md w-48 focus:outline-none"
                    />
                </div>
            </div>


            <div className="space-y-4">
                {connections?.map(conn => (
                    <ConnectionUserCard key={conn._id} user={conn} id={conn._id} confirmBlock={confirmBlock} confirmRemove={confirmRemove} />
                ))}
            </div>
        </div>
    )
}

export default Connections