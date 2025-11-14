
import api from "./api";

export const getAllSkills = async () => {
  try {
    const response = await api.get("/user/skills");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/user/feed");
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};