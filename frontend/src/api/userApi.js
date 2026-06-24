import { toast } from "react-toastify";
import api from "./api.js";

export const signUpUser = async (data) => {
  try {
    const response = await api.post("/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
};

export const getUserData = async (userId) => {
  try {
    const response = await api.get(`/user/viewprofile/${userId}`)
    return response;
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateProfilePicture = async (formData, setUploadProgress) => {
  try {    
    const response = await api.post("/user/uploadprofilepic", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total ? 
          (progressEvent.loaded / progressEvent.total) * 100 : 0;
        setUploadProgress(Math.round(progress));
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProfile = async (data) =>{
  try {
    const response = await api.patch("/user", data, {
      headers : {
        "Content-Type": "application/json"
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const blockUser = async (userId) => {
  try {
    const response = await api.patch(`/user/block/${userId}`);
    return response;
  }catch (error) {
    throw error;
  }
}

export const unblockUser = async (userId) => {
  try {
    const response = await api.patch(`/user/unblock/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
} 

export const getBlockedUsers = async () =>{
  try {
    const response = await api.get("/user/blockedusers");
    return response;
  } catch (error) {
      throw error;
  }
}

export const getDashboardData = async () => {
  try {
    const response = await api.get("/proposals/dashboard");
    return response;
  } catch (error) {
    throw error;
  }
}

export const logoutUser = async () =>{
  try {
    const response = await api.post("/auth/logout");
    return response;
  } catch (error) {
    throw error;
  }
}