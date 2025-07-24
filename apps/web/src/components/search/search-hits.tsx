'use client';

import { useHits } from 'react-instantsearch';
import Link from 'next/link';
import { formatDate } from '@/utils';
import { CategoryBadge } from '@/components/categoryBadge';
import type { CategoryColor } from '@/utils/categoryUtils';

interface BlogHit {
  objectID: string;
  title: string;
  description?: string;
  slug: string;
  publishedAt?: string;
  author?: {
    name: string;
    position?: string;
  };
  category?: {
    title: string;
    slug: string;
    color: CategoryColor;
    icon?: string;
  };
  imageUrl?: string;
}

interface SearchHitsProps {
  showEmptyState?: boolean;
}

export function SearchHits({ showEmptyState = true }: SearchHitsProps = {}) {
  const { hits } = useHits<BlogHit>();

  if (hits.length === 0 && showEmptyState) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  if (hits.length === 0 && !showEmptyState) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
      {hits.map((hit: BlogHit) => (
        <article key={hit.objectID} className="grid grid-cols-1 gap-4 w-full">
          <div className="relative w-full h-auto aspect-[16/9] overflow-hidden rounded-2xl">
            {hit.imageUrl ? (
              <img
                src={hit.imageUrl}
                alt={hit.title}
                className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover"
              />
            ) : (
              <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
          </div>
          
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              {hit.publishedAt && (
                <time className="text-sm text-muted-foreground">
                  {formatDate(hit.publishedAt)}
                </time>
              )}
              {hit.category && (
                <CategoryBadge
                  title={hit.category.title}
                  color={hit.category.color}
                  icon={hit.category.icon}
                  size="small"
                />
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold leading-tight">
                <Link
                  href={hit.slug}
                  className="hover:underline"
                >
                  {hit.title}
                </Link>
              </h2>
              
              {hit.description && (
                <p className="text-muted-foreground line-clamp-3">
                  {hit.description}
                </p>
              )}
            </div>
            
            {hit.author && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  by {hit.author.name}
                  {hit.author.position && ` 2 ${hit.author.position}`}
                </span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
} 