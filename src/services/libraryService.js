import apiClient from '../api/apiClient';

export const libraryService = {
    getBookStatus: async (isbn) => {
        const response = await apiClient.get(`/library/status/${isbn}`);
        return response.data.status;
    },

    updateBookStatus: async ({ isbn, status }) => {
        const response = await apiClient.post('/library/status', { isbn, status });
        return response.data;
    },

    removeFromLibrary: async (isbn) => {
        const response = await apiClient.delete(`/library/${isbn}`);
        return response.data;
    },

    getUserLibrary: async ({ status, pageParam }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        
        if (pageParam && pageParam.cursorDate && pageParam.cursorIsbn) {
            params.append('cursorDate', pageParam.cursorDate);
            params.append('cursorIsbn', pageParam.cursorIsbn);
        }

        const url = `/library?${params.toString()}`;
        const response = await apiClient.get(url);
        return response.data;
    }
};