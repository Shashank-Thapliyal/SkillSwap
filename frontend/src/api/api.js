import axios from "axios";
import {Appstore} from "../../store/store.js";
import { logout } from "../../store/userSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.setItem("logout", Date.now());

      Appstore.dispatch(logout());

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
