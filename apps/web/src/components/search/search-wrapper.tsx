'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { Configure, useSearchBox } from 'react-instantsearch';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia/client';
import { SearchBox } from './search-box';
import { SearchHits } from './search-hits';
import { SearchStats } from './search-stats';

interface SearchWrapperProps {
  categorySlug?: string;
  children?: React.ReactNode;
}

function SearchContent({ categorySlug, children }: SearchWrapperProps) {
  const { query } = useSearchBox();
  const hasQuery = query.trim().length > 0;

  return (
    <>
      <SearchBox categorySlug={categorySlug} />
      <div className="mt-8">
        {hasQuery ? (
          <>
            <SearchStats />
            <SearchHits />
          </>
        ) : (
          children
        )}
      </div>
    </>
  );
}

export function SearchWrapper({ categorySlug, children }: SearchWrapperProps) {
  return (
    <div className="mt-8 mb-12">
      <InstantSearchNext
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        {categorySlug && (
          <Configure filters={`category.slug:${categorySlug}`} />
        )}
        <SearchContent categorySlug={categorySlug}>
          {children}
        </SearchContent>
      </InstantSearchNext>
    </div>
  );
} 