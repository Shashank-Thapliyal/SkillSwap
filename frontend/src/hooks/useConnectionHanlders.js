import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/userSlice";
import api from "../api/api";
import {
  acceptConnectionRequest,
  rejectConnectionRequest,
  withdrawConnectionRequest,
} from "../api/requestApi";
import { useNavigate } from "react-router-dom";

const useConnectionHandlers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getUser = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.status === 200) {
        dispatch(setUser(res.data));
      }
    } catch (error) {
      toast.error("Failed to refresh user data");
      console.error("getUser error:", error);
    }
  };

  const handleAcceptRequest = async (reqId) => {
    try {
      const response = await acceptConnectionRequest(reqId);
      if (response.status === 200) {
        toast.success("Connection request accepted");
        await getUser();
      }
    } catch (error) {
      toast.error("Failed to accept request");
      console.error("Accept error:", error);
    }
  };

  const handleRejectRequest = async (reqId) => {
    try {
      const response = await rejectConnectionRequest(reqId);
      if (response.status === 200) {
        toast.success("Connection request rejected");
        await getUser();
      }
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Reject error:", error);
    }
  };

  const handleWithdrawRequest = async (reqId) => {
    try {
      const response = await withdrawConnectionRequest(reqId);
      if (response.status === 200) {
        toast.success("Request withdrawn successfully");
        await getUser();
      }
    } catch (error) {
      toast.error("Failed to withdraw request");
      console.error("Withdraw error:", error);
    }
  };

  const handleViewProfile = async (userId) => {
    navigate(`/profile/${userId}`);
 };
  return {
    handleAcceptRequest,
    handleRejectRequest,
    handleWithdrawRequest,
    handleViewProfile,
    getUser
  };
};

export default useConnectionHandlers;
