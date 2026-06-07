import { createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom"; 
import { useInfiniteFeed, useTrendingBooks } from "../hooks/useBooks";

const BookContext = createContext();

export const ALL_GENRES = ["Fiction", "Fantasy", "Science Fiction", "Mystery", "Romance", "Thriller", "Non-Fiction", "Historical"];

export const BookProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const sort = searchParams.get('sort') || 'discovery';
    const genreParam = searchParams.get('genre');
    const genres = genreParam ? genreParam.split(',') : [];

    const { data: trendingData, isLoading: isTrendingLoading } = useTrendingBooks();
    
    const filters = { sort, genre: genreParam };
    const feedQuery = useInfiniteFeed(filters);

    const feedBooks = useMemo(() => {
        if (!feedQuery.data) return [];
        return feedQuery.data.pages.flatMap(page => page.books);
    }, [feedQuery.data]);

    const toggleGenre = (g) => {
        const newParams = new URLSearchParams(searchParams);
        let updatedGenres = [...genres];
        
        if (updatedGenres.includes(g)) {
            updatedGenres = updatedGenres.filter((genre) => genre !== g);
        } else {
            updatedGenres.push(g);
        }

        if (updatedGenres.length > 0) {
            newParams.set('genre', updatedGenres.join(','));
        } else {
            newParams.delete('genre');
        }
        
        setSearchParams(newParams);
    };

    const setSort = (newSort) => {
        const newParams = new URLSearchParams(searchParams);
        if(newSort === 'discovery'){
            newParams.delete('sort');
        } else {
            newParams.set('sort', newSort);
        }
        setSearchParams(newParams);
    }

    const clearFilters = () => {
        setSearchParams(new URLSearchParams());
    };

    return (
        <BookContext.Provider value={{
            sort, setSort,
            genres,
            toggleGenre,
            clearFilters,
            
            trendingData,
            isTrendingLoading,
            
            feedBooks,
            feedQuery
        }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBookContext = () => useContext(BookContext);