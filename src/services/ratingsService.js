import apiClient from "../api/apiClient";

export const ratingsService = {

    getUserRating: async(isbn) => {
        const response = await apiClient.get(`/ratings/${isbn}/me`);
        return response.data.rating;
    },

    submitRating: async({isbn,rating}) => {
        const response = await apiClient.post(`/ratings`,{isbn,rating});
        return response.data;
    }
}