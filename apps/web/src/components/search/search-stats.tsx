'use client';

import { useStats } from 'react-instantsearch';

export function SearchStats() {
  const { nbHits, processingTimeMS } = useStats();

  return (
    <div className="text-sm text-muted-foreground mb-4">
      {nbHits} result{nbHits !== 1 ? 's' : ''} found in {processingTimeMS}ms
    </div>
  );
}