import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";

import { ArticleJsonLd } from "@/components/json-ld";
import { BlogCard, BlogHeader } from "@/components/blog-card";
import { getCategoryIcon } from "@/utils/categoryUtils";

// Simple category badge without colors for blog pages
function SimpleBlogCategoryBadge({ title, icon }: { title: string; icon?: string }) {
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
  
  const IconComponent = getCategoryIcon(icon || getDefaultIcon(title));
  
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-900 text-sm font-semibold rounded-full">
      {IconComponent && <IconComponent className="h-4 w-4" />}
      {title}
    </span>
  );
}
import { Pagination, PaginationInfo } from "@/components/pagination";
import { RichText } from "@/components/richtext";
import { SanityImage } from "@/components/sanity-image";
import { SearchWrapper } from "@/components/search/search-wrapper";
import { TableOfContent } from "@/components/table-of-content";
import { PokemonCard } from "@/components/pokemonCard";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogPaths, queryBlogSlugPageData, queryCategoryPaths, queryCategoryPageData } from "@/lib/sanity/query";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

const POSTS_PER_PAGE = 6;

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

function CategoryPageContent({ 
  categoryData, 
  blogs, 
  totalBlogs, 
  categorySlug,
  currentPage
}: {
  categoryData: any;
  blogs: Blog[];
  totalBlogs: number;
  categorySlug: string;
  currentPage: number;
}) {
  const { title, description, color, icon } = categoryData;
  
  const totalPages = Math.max(1, Math.ceil(totalBlogs / POSTS_PER_PAGE));
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = Math.min(startIndex + POSTS_PER_PAGE, totalBlogs);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, array) => {
      return array.indexOf(item) === index && item !== 1 || index === 0;
    });
  };

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <SimpleBlogCategoryBadge title={title} icon={icon} />
          </div>
          <BlogHeader 
            title={`${title} Blog Posts`}
            description={description || `Discover all our blog posts about ${title}`}
          />
        </div>

        <SearchWrapper categorySlug={categorySlug}>
          <div className="space-y-8">
            <PaginationInfo 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalBlogs}
              startIndex={startIndex}
              endIndex={endIndex}
            />

            {blogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
                {blogs.map((blog: Blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No blog posts found in the {title} category yet.
                </p>
              </div>
            )}

            <ServerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              getPageNumbers={getPageNumbers}
              categorySlug={categorySlug}
              className="mt-8"
            />
          </div>
        </SearchWrapper>
      </div>
    </main>
  );
}

function ServerPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  getPageNumbers,
  categorySlug,
  className,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  getPageNumbers: () => number[];
  categorySlug: string;
  className?: string;
}) {
  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams();
    if (page > 1) {
      searchParams.set('page', page.toString());
    }
    const queryString = searchParams.toString();
    return `/blog/${categorySlug}${queryString ? `?${queryString}` : ''}`;
  };

  const handleNextPage = () => {
    return hasNextPage ? handlePageChange(currentPage + 1) : '';
  };

  const handlePreviousPage = () => {
    return hasPreviousPage ? handlePageChange(currentPage - 1) : '';
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      onPageChange={handlePageChange}
      onNextPage={handleNextPage}
      onPreviousPage={handlePreviousPage}
      getPageNumbers={getPageNumbers}
      className={className}
    />
  );
}

async function fetchBlogSlugPageData(slug: string, stega = true) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug: `/blog/${slug}` },
    stega,
  });
}

async function fetchCategoryPageData(
  categorySlug: string, 
  page: number = 1,
  stega = true
) {
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE - 1;
  
  return await handleErrors(
    sanityFetch({
      query: queryCategoryPageData,
      params: { 
        categorySlug,
        startIndex,
        endIndex,
      },
      stega,
    })
  );
}

async function fetchAllPaths() {
  const [blogSlugs, categorySlugs] = await Promise.all([
    client.fetch(queryBlogPaths),
    client.fetch(queryCategoryPaths),
  ]);
  
  const paths: { slug: string }[] = [];
  
  for (const slug of blogSlugs) {
    if (!slug) continue;
    const parts = slug.split("/");
    if (parts.length >= 3 && parts[1] === "blog") {
      const postSlug = parts[2];
      if (postSlug) paths.push({ slug: postSlug });
    }
  }
  
  for (const slug of categorySlugs) {
    if (slug) paths.push({ slug });
  }
  
  return paths;
}

async function getPageType(slug: string): Promise<'blog' | 'category' | null> {
  const [categoryPaths, blogData] = await Promise.all([
    client.fetch(queryCategoryPaths),
    sanityFetch({
      query: queryBlogSlugPageData,
      params: { slug: `/blog/${slug}` },
      stega: false,
    }),
  ]);
  
  if (categoryPaths.includes(slug)) return 'category';
  if (blogData.data) return 'blog';
  return null;
}

export async function generateStaticParams() {
  return await fetchAllPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageType = await getPageType(slug);
  
  if (pageType === 'blog') {
    const { data } = await fetchBlogSlugPageData(slug, false);
    return getSEOMetadata(
      data
        ? {
            title: data?.title ?? data?.seoTitle ?? "",
            description: data?.description ?? data?.seoDescription ?? "",
            slug: data?.slug,
            contentId: data?._id,
            contentType: data?._type,
            pageType: "article",
          }
        : {},
    );
  } else if (pageType === 'category') {
    const [res] = await fetchCategoryPageData(slug, 1, false);
    const data = res?.data;
    
    return getSEOMetadata(
      data
        ? {
            title: data.seoTitle || `${data.title} Blog Posts`,
            description: data.seoDescription || data.description || `Browse all blog posts in the ${data.title} category`,
            slug: `/blog/${data.slug}`,
            contentId: data._id,
            contentType: data._type,
            pageType: "website",
          }
        : {}
    );
  }
  
  return {};
}

export default async function BlogSlugPage({ 
  params, 
  searchParams 
}: CategoryPageProps) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10));
  
  const pageType = await getPageType(slug);
  
  if (!pageType) return notFound();
  
  if (pageType === 'category') {
    const [res, err] = await fetchCategoryPageData(slug, currentPage);
    
    if (err || !res?.data) {
      return notFound();
    }

    const { blogs = [], totalBlogs = 0 } = res.data;
    
    return (
      <CategoryPageContent
        categoryData={res.data}
        blogs={blogs}
        totalBlogs={totalBlogs}
        categorySlug={slug}
        currentPage={currentPage}
      />
    );
  }
  
  const { data } = await fetchBlogSlugPageData(slug);
  if (!data) return notFound();
  
  const { title, description, image, richText, pokemon } = data ?? {};

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <ArticleJsonLd article={stegaClean(data)} />
          <header className="mb-8">
            <h1 className="mt-2 text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>
          {image && (
            <div className="mb-12">
              <SanityImage
                asset={image}
                alt={title}
                width={1600}
                loading="eager"
                priority
                height={900}
                className="rounded-lg h-auto w-full"
              />
            </div>
          )}
          <RichText richText={richText ?? []} />
          
          {/* Mobile Pokemon Card */}
          {pokemon && (
            <div className="mt-12 lg:hidden">
              <h3 className="text-lg font-semibold mb-4">Featured Pokemon</h3>
              <PokemonCard pokemon={pokemon} />
            </div>
          )}
        </main>

        <div className="hidden lg:block">
          <div className="sticky top-4 rounded-lg space-y-6">
            <TableOfContent richText={richText} />
            {pokemon && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Featured Pokemon</h3>
                <PokemonCard pokemon={pokemon} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 