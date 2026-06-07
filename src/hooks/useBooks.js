import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { bookService } from '../services/bookService';
import { useSettings } from '../Context/SettingsContext'; 

export const useInfiniteFeed = (filters) => {
    const { isSafeMode } = useSettings();

    return useInfiniteQuery({
        queryKey: ['books', 'feed', filters, { safe: isSafeMode }],
        queryFn: ({ pageParam = null }) => {
            return bookService.getBooks({
                ...filters,
                safe_mode: isSafeMode,
                ...(pageParam || {})
            });
        },
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
        staleTime: 5 * 60 * 1000,
    });
};

export const useForYouFeed = () => {
    const { isSafeMode } = useSettings();

    return useInfiniteQuery({
        queryKey: ['books', 'for-you', { safe: isSafeMode }],
        queryFn: ({ pageParam = null }) => {
            return bookService.getFeed({
                limit: 20,
                safe_mode: isSafeMode,
                ...(pageParam || {})
            });
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined;
        },
        staleTime: 1000 * 60 * 5, 
    });
};

export const useTrendingBooks = () => {
    const { isSafeMode } = useSettings();

    return useQuery({
        queryKey: ['books', 'trending', { safe: isSafeMode }],
        queryFn: () => bookService.getTrendingBooks({ safe_mode: isSafeMode }),
        staleTime: 10 * 60 * 1000,
        select: (data) => data.books,
    });
};

export const useTopSearchedBooks = () => {
    const { isSafeMode } = useSettings();

    return useQuery({
        queryKey: ['books', 'top-searched', { safe: isSafeMode }],
        queryFn: () => bookService.getTopSearchedBooks({ safe_mode: isSafeMode }),
        staleTime: 10 * 60 * 1000,
    });
};

// Direct ISBN lookups don't need the safe mode flag
export const getBookByIsbn = (isbn) => {
    return useQuery({
        queryKey: ['book', isbn],
        queryFn: () => bookService.getBookByIsbn(isbn),
        enabled: !!isbn,
        staleTime: 5 * 60 * 1000,
    });
};

export const useAutocomplete = (query) => {
    const { isSafeMode } = useSettings();

    return useQuery({
        queryKey: ['books', 'autocomplete', query, { safe: isSafeMode }],
        queryFn: () => bookService.autoCompleteBooks(query, isSafeMode),
        enabled: query.length > 2,
        staleTime: 5 * 60 * 1000,
    });
};

export const useInfiniteSearch = (query) => {
    const { isSafeMode } = useSettings();

    return useInfiniteQuery({
        queryKey: ['books', 'search', query, { safe: isSafeMode }],
        queryFn: ({ pageParam = null }) => {
            return bookService.searchBooks({
                query,
                safe_mode: isSafeMode,
                cursorYear: pageParam?.cursorYear,
                cursorIsbn: pageParam?.cursorIsbn   
            });
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        enabled: !!query,
    });
}

export const useSimilarBooks = (isbn, limit = 6) => {
    const { isSafeMode } = useSettings();

    return useQuery({
        queryKey: ['books', 'similar', isbn, limit, { safe: isSafeMode }],
        queryFn: async () => {
            try {
                const data = await bookService.getSimilarBooks(isbn, limit, isSafeMode);
                return data;
            } catch (error) {
                throw error;
            }
        }, 
        enabled: !!isbn, 
        staleTime: 1000 * 60 * 60 * 24,
    });
};