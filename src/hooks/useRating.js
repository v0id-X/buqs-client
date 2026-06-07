import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { ratingsService } from "../services/ratingsService";
import { bookService } from "../services/bookService";
import { Variable } from "lucide-react";

export const useUserRating = (isbn) =>{
    return useQuery({
        queryKey: ['books','userRating',isbn],
        queryFn: ()=>ratingsService.getUserRating(isbn),
        enabled: !!isbn,
        staleTime: Infinity,
        refetchOnWindowFocus: 'always',
    });
};

export const useSubmitRating = () =>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ratingsService.submitRating,
            onSuccess: (data,variables) => { queryClient.setQueryData(['books','userRating',variables.isbn],variables.rating)
            queryClient.invalidateQueries(['books', 'details', variables.isbn]);
        },
        onError: (error) =>{
            console.error("Failed to rate",error.response?.data?.error || error.message);
        }
    });
    
};