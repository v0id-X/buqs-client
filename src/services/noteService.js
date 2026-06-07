import apiClient from '../api/apiClient.js';

const mapNote = (n) => ({
    id: n.id,
    title: n.title,
    body: n.content,
    createdAt: n.created_at,
    updatedAt: n.updated_at
});

export const noteService = {
    getNotes: async ({ pageParam, search }) => {
        const params = new URLSearchParams();
        if (pageParam) params.append('cursor', pageParam);
        if (search) params.append('search', search);

        const response = await apiClient.get(`/notes?${params.toString()}`);
        
        return {
            data: response.data.data.map(mapNote),
            nextCursor: response.data.nextCursor
        };
    },
    getNote: async (id) => {
        const response = await apiClient.get(`/notes/${id}`);
        return mapNote(response.data);
    },
    createNote: async ({ title, body }) => {
        const response = await apiClient.post('/notes', { title, content: body });
        return mapNote(response.data);
    },
    updateNote: async ({ id, title, body }) => {
        const response = await apiClient.put(`/notes/${id}`, { title, content: body });
        return mapNote(response.data);
    },
    deleteNote: async (id) => {
        const response = await apiClient.delete(`/notes/${id}`);
        return response.data;
    }
};