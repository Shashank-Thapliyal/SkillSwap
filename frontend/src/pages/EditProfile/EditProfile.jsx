import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePictureUpload from "../../components/UploadProfilePic";
import ProfileForm from "../../components/ProfileForm";
import Loader from "../../components/Loader";

const EditProfile = () => {
  const loggedInUser = useSelector(state => state.user);
  const [profilePic, setProfilePic] = useState("");
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {

    console.log("happened")
    if(loggedInUser?.profile){
      setIsloading(false);
    }
    if (loggedInUser?.profile?.profilePic) {
      setProfilePic(loggedInUser.profile.profilePic);
    }
  }, [loggedInUser]);

  if(isLoading){
    return  <Loader />
}

  return (
    <div className="min-h-screen bg-[#1E1E2F] flex items-center justify-center px-4 py-10 ">
      <div className="w-full max-w-3xl p-6 bg-[#252538] rounded-xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold mt-4">Edit Your Profile</h2>
        </div>
        <ProfilePictureUpload userPic={profilePic}/>
        <ProfileForm loggedInUser={loggedInUser} />
      </div>
    </div>
  );
};

export default EditProfile;
