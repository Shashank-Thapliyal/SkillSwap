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
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("response api: " , response)
    return response;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message)
  }
};
