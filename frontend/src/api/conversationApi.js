import api from "./api";

export const getConversations = async () => {
  try {
    const response = await api.get(`/conversations`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMessages = async (userId) => {
  try{
    if(!userId){
      return;
    }
    const response = await api.get(`/messages/${userId}`);
    return response;
  }catch(error){
    throw error;
  }
};

export const sendMessage = async (message) => {
  try{
    console.log(message);
    const response = await api.post(`/conversations`, message);
    return response;
  }catch(error){
    throw error;
  }
}