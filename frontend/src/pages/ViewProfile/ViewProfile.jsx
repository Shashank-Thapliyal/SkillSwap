import { useEffect, useState } from "react";
import ProfileHeader from "../../components/ProfileHeader";
import ProfileBody from "../../components/ProfileBody";
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { getUserData } from "../../api/userApi";
import Loader from "../../components/Loader";

const ViewProfile = () => {

  const loggedInUser = useSelector(state => state.user)
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsloading] = useState(true);

  const { userId } = useParams();
  
  useEffect(() => {
    const fetchUser = async () => {
      setIsloading(true);
  
      if (!userId) {
        if (loggedInUser && Object.keys(loggedInUser).length > 0) {
          setIsOwnProfile(true);
          setUserDetails(loggedInUser);
        } else {
          return;
        }
      } else {
        try {
          const user = await getUserData(userId);
          setUserDetails(user.data?.data);
        } catch (error) {
          console.log(error);
        }
      }
      setIsloading(false);
    };
  
    fetchUser();
  }, [userId, loggedInUser]);
  console.log("userDetials:", userDetails);

  if(isLoading){
    console.log("loading")
    return  <Loader />
}
  return (
    <div className="min-h-screen bg-[#1E1E2F] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader data={userDetails} isOwnProfile={isOwnProfile} />
        <ProfileBody data={userDetails} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
};

export default ViewProfile;
