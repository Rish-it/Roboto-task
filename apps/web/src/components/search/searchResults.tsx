'use client';

import { useHits, useStats } from 'react-instantsearch';
import Link from 'next/link';
import { Clock, User, ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { BlogHit } from '@/types/search';

export const SearchResults = memo(() => {
  const { hits } = useHits<BlogHit>();
  const { nbHits, processingTimeMS } = useStats();

  if (hits.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-dashed border-muted-foreground rounded-full" />
        </div>
        <h3 className="text-lg font-medium mb-2">No articles found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or browse all articles below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {nbHits} result{nbHits !== 1 ? 's' : ''} found in {processingTimeMS}ms
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hits.map((hit) => (
          <SearchResultCard key={hit.objectID} hit={hit} />
        ))}
      </div>
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

interface SearchResultCardProps {
  hit: BlogHit;
}

const SearchResultCard = memo(({ hit }: SearchResultCardProps) => {
  return (
    <Link href={hit.slug} className="group block">
      <article className="h-full bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {hit.imageUrl && (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img 
              src={hit.imageUrl} 
              alt={hit.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
            {hit.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{hit.author.name}</span>
              </div>
            )}
            
            {hit.publishedAt && (
              <>
                {hit.author && <span>•</span>}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <time>{formatRelativeDate(hit.publishedAt)}</time>
                </div>
              </>
            )}
          </div>
          
          <h3 className="font-semibold text-lg leading-tight mb-3 group-hover:text-primary transition-colors">
            {hit.title}
          </h3>
          
          {hit.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
              {hit.description}
            </p>
          )}
          
          <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
            <span>Read article</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </article>
    </Link>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  
  return `${Math.floor(diffInDays / 365)}y ago`;
}; 