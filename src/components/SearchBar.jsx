import { Search, X, Loader2 } from "lucide-react";
import { useSearch } from "../Context/SearchContext";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

export const SearchBar = ({ 
  placeholder = "Search books or authors..." 
}) => {
  const { 
    searchQuery, setSearchQuery, handleSearchSubmit, clearSearch, 
    suggestions, isAutocompleteLoading 
  } = useSearch();
  
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isFocused) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true); 
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isFocused, suggestions]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        handleSearchSubmit();
        setIsFocused(false);
        navigate('/search');
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current && !wrapperRef.current.contains(event.target) &&
        !event.target.closest('#search-dropdown-portal')
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = isFocused && searchQuery && suggestions?.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-border pl-9 pr-10 py-2 sm:py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors truncate"
      />

      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
        {isAutocompleteLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        ) : searchQuery ? (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="w-7 h-7 rounded-full hover:bg-secondary flex items-center justify-center text-muted-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {showDropdown && ReactDOM.createPortal(
        <div id="search-dropdown-portal" className="absolute z-[9999]" style={{
            top: `${dropdownPos.top + 4}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`
        }}>
          <ul
            role="listbox"
            className="w-full bg-card border border-border rounded-xl shadow-xl overflow-y-auto max-h-[45vh] sm:max-h-[50vh] overscroll-contain"
          >
            {suggestions.slice(0, 6).map((b) => (
              <li key={b.isbn || b.id}>
                <Link
                  to={`/books/${b.isbn || b.id}`}
                  onClick={() => {
                    setIsFocused(false);
                    clearSearch();
                  }}
                  className="flex items-center gap-3 px-3 py-2 sm:px-4 hover:bg-secondary transition-colors"
                >
                  <div className="w-7 h-9 sm:w-8 sm:h-10 rounded bg-muted overflow-hidden shrink-0">
                    <img
                      src={b.cover_image || b.cover}
                      alt=""
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {b.author}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchBar;