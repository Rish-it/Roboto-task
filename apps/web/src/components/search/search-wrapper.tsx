'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { searchClient, ALGOLIA_INDEX_NAME } from '@/lib/algolia/client';
import { SearchBox } from './search-box';
import { SearchHits } from './search-hits';
import { SearchStats } from './search-stats';

export function SearchWrapper() {
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