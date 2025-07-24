'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia/client';
import { SearchInput } from './searchInput';
import { SearchResults } from './searchResults';
import { ConditionalBlogList } from './conditionalBlogList';
import { useSearchState } from '@/hooks/useSearchState';
import { memo, ReactNode } from 'react';

interface SearchWrapperProps {
  className?: string;
  children?: ReactNode;
}

export const SearchWrapper = memo(({ className = "", children }: SearchWrapperProps) => {
  return (
    <div className={`space-y-8 ${className}`}>
      <InstantSearchNext
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <SearchContent>{children}</SearchContent>
      </InstantSearchNext>
    </div>
  );
});

SearchWrapper.displayName = 'SearchWrapper';

interface SearchContentProps {
  children?: ReactNode;
}

const SearchContent = memo(({ children }: SearchContentProps) => {
  const { query } = useSearchState();
  
  return (
    <>
      <SearchInput />
      
      {query.length > 0 ? (
        <div className="animate-in fade-in-50 duration-300">
          <SearchResults />
        </div>
      ) : (
        <ConditionalBlogList>
          {children}
        </ConditionalBlogList>
      )}
    </>
  );
});

SearchContent.displayName = 'SearchContent'; 