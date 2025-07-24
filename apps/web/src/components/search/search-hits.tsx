'use client';

import { useHits } from 'react-instantsearch';
import Link from 'next/link';
import { formatDate } from '@/utils';
import { CategoryBadge } from '@/components/category-badge';

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
    color: string;
    icon?: string;
  };
  imageUrl?: string;
}

export function SearchHits() {
  const { hits } = useHits<BlogHit>();

  if (hits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
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
            {hit.publishedAt && (
              <time className="text-sm text-muted-foreground">
                {formatDate(hit.publishedAt)}
              </time>
            )}
            
            <div className="space-y-2">
              {hit.category && (
                <CategoryBadge
                  title={hit.category.title}
                  color={hit.category.color}
                  icon={hit.category.icon}
                  size="small"
                />
              )}
              
              <h2 className="text-xl font-semibold leading-tight">
                <Link
                  href={`/blog/post${hit.slug.replace('/blog', '')}`}
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