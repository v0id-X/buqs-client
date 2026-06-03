import apiClient from '../api/apiClient';

export const authService = {

    register : async (userData) => {
        const response = await apiClient.post('/auth/register',userData);
        return response.data;
    },

    login : async (credentials) => {
        const response = await apiClient.post('/auth/login',credentials);
        return response.data;
    },

    googleAuth: async (token) => {
        const response = await apiClient.post('/auth/google-auth',{token});
        return response.data;
    },

    forgotPassword : async (email) => {
        const response = await apiClient.post('/auth/forgot-password/',{email});
        return response.data;
    },

    resetPassword : async (token,newPassword) => {
        const response = await apiClient.post(`/auth/reset-password/${token}`,{password:newPassword});
        return response.data;
    }

}