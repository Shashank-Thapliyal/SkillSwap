import React, { useEffect, useRef, useState } from "react";
import { PencilLine } from "lucide-react"
import { updateProfilePicture } from "../api/userApi";
import { OutlineButton, PrimaryButton, SecondaryButton } from "./Buttons";
import { toast } from "react-toastify";

const ProfilePictureUpload = ({ userPic }) => {
  const [uploadPreview, setUploadPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    setProfilePic(userPic)
  }, [userPic])

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    setIsUploading(true);
    console.log("changing the pic")
    const res = await updateProfilePicture(formData, setUploadProgress);

    if (res?.data?.url) {
      setProfilePic(res.data.url);
      setUploadProgress(100);
      setIsUploading(false);
      toast.success("Profile picture uploaded successfully");
    }
  }

  const handleFileChange = (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      setSelectedFile(file);
      setUploadProgress(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);

      document.getElementById('image_preview_modal').classList.replace("hidden", "block")

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed, try again.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const closeImageModal = () => {
    document.getElementById("image_preview_modal").classList.replace("block", "hidden")
  }

  const handleConfirm = () => {
    if (selectedFile) {
      uploadPhoto(selectedFile);
    }
    closeImageModal()
  }
  return (
    <div className="mt-4 w-full m-auto mb-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full bg-[#2A2A40] border-2 border-[#3C3C55] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#4A4A65] transition-colors group"
            onClick={handleClick}
          >

            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile Pic"
                className="w-full h-full object-cover group-hover:brightness-75 transition-all"
              />
            ) : (
              <div className="text-[#A0A0B0] text-3xl group-hover:text-white transition-colors">👤</div>
            )}

          </div>
          <button
            type="button"
            onClick={handleClick}
            className="absolute -top-1 -right-1 w-8 h-8 bg-[#4A4A65] hover:bg-[#5A5A75] rounded-full flex items-center justify-center border-2 border-[#2A2A40] transition-colors"
          >
            <PencilLine className="text-white" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div id="image_preview_modal" className="hidden">
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="relative bg-[#1c1c2a] text-white p-6 rounded-lg w-[90%] max-w-md shadow-lg flex flex-col items-center">
              <div
                className="w-64 h-64 rounded-full bg-[#2A2A40] mx-auto border-2 border-[#3C3C55] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#4A4A65] transition-colors group"

              >
                {
                  uploadPreview &&
                  <img src={uploadPreview} alt="Profile Preview" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                }
              </div>
              <p className="py-4 text-sm text-[#A0A0B0]">Your Profile Picture will look like this</p>
              <button
                onClick={() => closeImageModal()}
                className="absolute top-2 right-3 text-white text-xl font-bold"
              >
                ×
              </button>

              <div className="mt-3 flex gap-2 justify-end w-full">
                <OutlineButton onClick={() => closeImageModal()} className="bg-red-400 hover:bg-red-500 hover:text-black hover:border-1 hover:border-black text-black">
                  Cancel
                </ OutlineButton>
                <SecondaryButton onClick={handleConfirm} > Confirm</SecondaryButton>
              </div>
            </div>
          </div>


        </div>

        {isUploading && (
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-48 h-2 rounded-full bg-[#3C3C55] overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-[#A0A0B0]">
              Uploading... {Math.round(uploadProgress)}%
            </span>
          </div>
        )}

        <p className="text-xs text-[#A0A0B0] text-center">
          Click to change profile picture<br />
          <span className="text-[#808090]">JPG, PNG, GIF (Max 5MB)</span>
        </p>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;