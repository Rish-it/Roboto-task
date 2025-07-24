'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia/client';
import { SearchBox } from './search-box';
import { SearchHits } from './search-hits';
import { SearchStats } from './search-stats';

interface SearchWrapperProps {
  categorySlug?: string;
}

export function SearchWrapper({ categorySlug }: SearchWrapperProps = {}) {
  return (
    <div className="mt-8 mb-12">
      <InstantSearchNext
        searchClient={searchClient}
        indexName={ALGOLIA_INDEX_NAME}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <SearchBox />
        <div className="mt-8">
          <SearchStats />
          <SearchHits />
        </div>
      </InstantSearchNext>
    </div>
  );
} 