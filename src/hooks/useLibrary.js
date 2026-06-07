
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { libraryService } from "../services/libraryService"; 

export const useBookStatus = (isbn) => {
    return useQuery({
        queryKey: ['library', 'status', isbn],
        queryFn: () => libraryService.getBookStatus(isbn),
        enabled: !!isbn,
        staleTime: Infinity,
    });
};

export const useUpdateLibrary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: libraryService.updateBookStatus,
        onSuccess: (data, variables) => {
            queryClient.setQueryData(['library', 'status', variables.isbn], variables.status);
            queryClient.invalidateQueries({ queryKey: ['library', 'lists'] });
        }
    });
};

export const useRemoveFromLibrary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (isbn) => libraryService.removeFromLibrary(isbn),
        onSuccess: (data, isbn) => {
            queryClient.setQueryData(['library', 'status', isbn], null);
            queryClient.invalidateQueries({ queryKey: ['library', 'lists'] });
        }
    });
};

export const useUserLibrary = (status) => {
    return useInfiniteQuery({
        queryKey: ['library', 'lists', status],
        queryFn: ({ pageParam = null }) => libraryService.getUserLibrary({ status, pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        initialPageParam: null,
    });
};