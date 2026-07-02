import apiClient from '../api/apiClient.js'

export const bookService = {
    
    getBooks: async (params) => {
        const response = await apiClient.get('/books', { params });
        return response.data;
    },

    getBookByIsbn: async (isbn) => {
        if(!isbn) return null;
        const response = await apiClient.get(`/books/${isbn}`);
        return response.data;
    },

    getFeed: async (params = {}) => {
        if(!params.limit) params.limit = 20;
        const response = await apiClient.get(`/books/for-you`, { params });
        return response.data;
    },

    searchBooks: async (params) => {
        const response = await apiClient.get('/books/search', { params });
        return response.data;
    },

    getTrendingBooks: async (params) => {
        const response = await apiClient.get('/books/trending', { params });
        return response.data;
    },

    autoCompleteBooks: async (query, safe_mode) => {
        if(!query || query.length < 2) return [];
        const response = await apiClient.get('/books/autocomplete', {
            params: { query, safe_mode }
        });
        return response.data;
    },

    getSimilarBooks: async (isbn, limit = 10, safe_mode) => {
        const response = await apiClient.get(`/books/${isbn}/similar`, {
            params: { limit, safe_mode }
        });
        return response.data;
    },
};