'use client';

import { useStats } from 'react-instantsearch';

export function SearchStats() {
  const { nbHits, processingTimeMS } = useStats();

  if (nbHits === 0) return null;

  return (
    <div className="mb-4 text-sm text-muted-foreground">
      {nbHits} result{nbHits !== 1 ? 's' : ''} found in {processingTimeMS}ms
    </div>
  );
} 