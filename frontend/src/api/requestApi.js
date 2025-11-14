import api from "./api";

export const sendConnectionRequest = async (userId) =>{
    try {
        const response = await api.post(`/requests/send/${userId}`,  {} , {
            headers : {
                "Content-Type" : "application/json",
            }        
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const acceptConnectionRequest = async (reqId) =>{
    try {
        const response = await api.patch(`/requests/respond/${reqId}`,  {status : "accepted"}, {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const rejectConnectionRequest = async (userId) =>{
    try {
        const response = await api.patch(`/requests/respond/${userId}`,  {status : "ignored"}, {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const withdrawConnectionRequest = async (reqId) =>{
    try {
        const response = await api.delete(`/requests/withdraw/${reqId}`,  {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export const removeConnection = async (userId) =>{
    try {
        const response = await api.delete(`/user/connections/remove/${userId}`,  {
            headers : {
                "Content-Type" : "application/json",
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
}