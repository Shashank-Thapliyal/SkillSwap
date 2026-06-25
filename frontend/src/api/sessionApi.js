import api from "./api";

export const getSessionsWithReceiver = async (userId) => {
    try {
        const response = await api.get(`/sessions/with/${userId}`);
        return response;
    } catch (error) {
        throw(error);
    }
}

export const cancelSelectedSession = async (sessionId) => {
    try {
        const response = await api.patch(`/sessions/cancel/${sessionId}`);
        return response;
    } catch (error) {
        throw error;
    }
}