'use client';

import { useHits } from 'react-instantsearch';
import Link from 'next/link';
import { formatDate } from '@/utils';
import { getCategoryIcon } from '@/utils/categoryUtils';

// Simple category badge without colors for search results
function SimpleSearchCategoryBadge({ category }: { category: any }) {
  const getDefaultIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('tech') || titleLower.includes('code') || titleLower.includes('dev')) return 'Code';
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) return 'Palette';
    if (titleLower.includes('business') || titleLower.includes('marketing')) return 'TrendingUp';
    if (titleLower.includes('tutorial') || titleLower.includes('guide')) return 'BookOpen';
    if (titleLower.includes('news') || titleLower.includes('update')) return 'Newspaper';
    if (titleLower.includes('ai') || titleLower.includes('artificial')) return 'Brain';
    if (titleLower.includes('mobile') || titleLower.includes('app')) return 'Smartphone';
    if (titleLower.includes('web') || titleLower.includes('frontend')) return 'Globe';
    if (titleLower.includes('data') || titleLower.includes('analytics')) return 'BarChart3';
    if (titleLower.includes('security') || titleLower.includes('crypto')) return 'Shield';
    return 'Tag';
  };
  
  const IconComponent = getCategoryIcon(category.icon || getDefaultIcon(category.title));
  
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-900 text-xs font-semibold rounded-full">
      {IconComponent && <IconComponent className="h-3 w-3" />}
      {category.title}
    </span>
  );
}

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
    icon?: string;
  };
  imageUrl?: string;
}

interface SearchHitsProps {
  showEmptyState?: boolean;
}

export function SearchHits({ showEmptyState = true }: SearchHitsProps) {
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
                <SimpleSearchCategoryBadge category={hit.category} />
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
                    {hit.author.position && ` • ${hit.author.position}`}
                  </span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
} 