'use client';

import { useSearchState } from '@/hooks/useSearchState';
import { memo, ReactNode } from 'react';

interface ConditionalBlogListProps {
  children: ReactNode;
}

export const ConditionalBlogList = memo(({ children }: ConditionalBlogListProps) => {
  const { query } = useSearchState();
  
  if (query.length > 0) {
    return null;
  }
  
  return (
    <div className="animate-in fade-in-50 duration-300">
      {children}
    </div>
  );
});

ConditionalBlogList.displayName = 'ConditionalBlogList'; 