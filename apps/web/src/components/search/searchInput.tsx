'use client';

import { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchState } from '@/hooks/useSearchState';
import { SearchSuggestions } from './searchSuggestions';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({ 
  placeholder = "Search blogs...", 
  className = "" 
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    query,
    isSearching,
    showSuggestions,
    suggestions,
    handleQueryChange,
    handleClear,
    handleSuggestionSelect,
    setShowSuggestions,
  } = useSearchState();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    if (query.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl mx-auto ${className}`}>
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full h-10 pl-12 pr-10 rounded-full border border-border bg-background/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-base"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-4 w-4 text-foreground transition-colors" />
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          ) : query.length > 0 ? (
            <button
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-muted transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          ) : null}
        </div>
      </div>

      {showSuggestions && query.length > 0 && (
        <SearchSuggestions
          suggestions={suggestions}
          onSuggestionSelect={handleSuggestionSelect}
          query={query}
        />
      )}
    </div>
  );
}; 