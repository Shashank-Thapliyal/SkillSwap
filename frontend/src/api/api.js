import axios from "axios"

const api = axios.create({
    baseURL : "http://localhost:5000/api",
    withCredentials : true
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      console.log("No internet");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;