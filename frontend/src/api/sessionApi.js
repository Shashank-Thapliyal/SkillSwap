import api from "./api";

export const getSessionsWithReceiver = async (userId) => {
    try {
        const response = await api.get(`/sessions/${userId}`);
        return response;
    } catch (error) {
        throw(error);
    }
}