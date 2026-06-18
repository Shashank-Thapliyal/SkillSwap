import api from "./api";

export const sendProposalReq = async (userId, proposalData) => {
  try {
    const response = await api.post(`/proposals/send/${userId}`, proposalData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSentProposals = async (userId) => {
  try {
    const response = await api.get(`/proposals/sent`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getProposalBetween = async (otherUserId) => {
  try {
    const response = await api.get(`/proposals/with/${otherUserId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelProposalRequest = async (proposalId) => {
  try {
    const response = await api.delete(`/proposals/${proposalId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const acceptProposalRequest = async (proposalId, timeSlot) => {
  try {
    const response = await api.patch(
      `/proposals/${proposalId}`,
      {
        status: "accepted",
        timeSlot,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReceivedProposals = async () => {
  try {
    const response = await api.get("/proposals/received");
    return response;
  } catch (error) {
    throw error;
  }
};

export const declineProposalRequest = async (proposalId) => {
  try {
    const response = await api.patch(
      `/proposals/${proposalId}`,
      {
        status: "declined",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};
