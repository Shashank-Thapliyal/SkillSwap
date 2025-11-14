import api from "./api";

export const sendProposalReq = async (userId, proposalData) => {
    try {
        const response = await api.post(`/proposals/send/${userId}`, proposalData, {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const getSentProposals = async (userId) => {
    try {
        const response = await api.get(`/proposals/with/${userId}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export const cancelProposalRequest = async(proposalId) => {
    try {
        const response = await api.delete(`/proposals/${proposalId}`, {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}