'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { BlogHit } from '@/types/search';

interface SearchSuggestionsProps {
  suggestions: BlogHit[];
  onSuggestionSelect: (suggestion: BlogHit) => void;
  query: string;
}

export const SearchSuggestions = ({ 
  suggestions, 
  onSuggestionSelect, 
  query 
}: SearchSuggestionsProps) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const suggestion = suggestions[selectedIndex];
        if (suggestion) {
          onSuggestionSelect(suggestion);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, suggestions, onSuggestionSelect]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  if (suggestions.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg backdrop-blur-sm p-4 z-50">
        <div className="flex items-center gap-3 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm">No articles found for "{query}"</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl backdrop-blur-sm overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="p-2">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <TrendingUp className="h-3 w-3" />
          Articles
        </div>
        
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion.objectID}
              suggestion={suggestion}
              isSelected={index === selectedIndex}
              onClick={() => onSuggestionSelect(suggestion)}
              query={query}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface SuggestionItemProps {
  suggestion: BlogHit;
  isSelected: boolean;
  onClick: () => void;
  query: string;
}

const SuggestionItem = ({ 
  suggestion, 
  isSelected, 
  onClick, 
  query 
}: SuggestionItemProps) => {
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Link href={suggestion.slug} onClick={onClick}>
      <div 
        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
          isSelected 
            ? 'bg-accent text-accent-foreground' 
            : 'hover:bg-muted/50'
        }`}
      >
        {suggestion.imageUrl && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted">
            <img 
              src={suggestion.imageUrl} 
              alt={suggestion.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm leading-5 mb-1 truncate">
            {highlightMatch(suggestion.title, query)}
          </h4>
          
          {suggestion.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-4">
              {suggestion.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            {suggestion.author && (
              <span>{suggestion.author.name}</span>
            )}
            {suggestion.publishedAt && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(suggestion.publishedAt)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}; 