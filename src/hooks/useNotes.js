import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { noteService } from "../services/noteService";
import { toast } from "sonner";

export const useNotesList = (search) => {
    return useInfiniteQuery({
        queryKey: ['notes', search],
        queryFn: ({ pageParam = null }) => noteService.getNotes({ pageParam, search }),
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        initialPageParam: null,
    });
};

export const useNote = (id) => {
    return useQuery({
        queryKey: ['notes', id],
        queryFn: () => noteService.getNote(id),
        enabled: !!id,
    });
};

export const useCreateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: noteService.createNote,
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
        }
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: noteService.updateNote,
        onSuccess: (data) => {
            queryClient.setQueryData(['notes', data.id.toString()], data);
            queryClient.invalidateQueries(['notes']);
        }
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: noteService.deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries(['notes']);
            toast.success("Note deleted");
        }
    });
};