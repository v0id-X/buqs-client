import { createContext, useContext, useState } from 'react';
import { useInfiniteSearch, useAutocomplete } from '../hooks/useBooks';
import { useDebounce } from '../hooks/useDebounce'; 

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState("");
    
    const debouncedQuery = useDebounce(searchQuery, 300);

    const [submittedQuery, setSubmittedQuery] = useState("");

    const autocompleteQuery = useAutocomplete(debouncedQuery);
    
    const searchResultsQuery = useInfiniteSearch(submittedQuery);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (searchQuery.trim()) {
            setSubmittedQuery(searchQuery.trim());
        }
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSubmittedQuery("");
    };

    return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            
            handleSearchSubmit,
            clearSearch,
            
            suggestions: autocompleteQuery.data || [],
            isAutocompleteLoading: autocompleteQuery.isLoading,
            
            searchResults: searchResultsQuery,
            
            isSearchActive: !!submittedQuery, 
            submittedQuery 
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);