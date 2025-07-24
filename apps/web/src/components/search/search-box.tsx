'use client';

import { useState } from 'react';
import { useSearchBox } from 'react-instantsearch';
import { Search, X } from 'lucide-react';

interface SearchBoxProps {
  categorySlug?: string;
}

export function SearchBox({ categorySlug }: SearchBoxProps = {}) {
  const { query, refine, clear } = useSearchBox();
  const [inputValue, setInputValue] = useState(query);
  
  const placeholder = categorySlug 
    ? `Search in this category...`
    : `Search blog posts...`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refine(inputValue);
  };

  const handleReset = () => {
    setInputValue('');
    clear();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="search"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            refine(e.target.value);
          }}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-10"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}