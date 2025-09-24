import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { BlogCard, BlogHeader } from "@/components/blog-card";
import { CategoryNavigation } from "@/components/categoryNavigation";
import { sanityFetch } from "@/lib/sanity/live";
import { 
  queryCategoryBySlug, 
  queryBlogsByCategory, 
  queryCategoriesList 
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const POSTS_PER_PAGE = 6;

interface Category {
  _id: string;
  title: string;
  description?: string;
  icon?: string;
  seoTitle?: string;
  seoDescription?: string;
}

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

async function fetchCategoryData(categorySlug: string) {
  return await handleErrors(
    sanityFetch({ 
      query: queryCategoryBySlug, 
      params: { slug: categorySlug } 
    })
  );
}

async function fetchCategoryBlogs(categorySlug: string, page: number) {
  const offset = (page - 1) * POSTS_PER_PAGE;
  return await handleErrors(
    sanityFetch({ 
      query: queryBlogsByCategory, 
      params: { 
        categorySlug, 
        limit: POSTS_PER_PAGE, 
        offset 
      } 
    })
  );
}

async function fetchCategories() {
  return await handleErrors(
    sanityFetch({ query: queryCategoriesList })
  );
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug: categorySlug } = await params;
  const [categoryRes] = await fetchCategoryData(categorySlug);
  
  if (!categoryRes?.data) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found."
    };
  }

  const category = categoryRes.data;
  
  return getSEOMetadata({
    title: category.seoTitle || `${category.title} Articles`,
    description: category.seoDescription || 
      `Browse all articles in the ${category.title} category. Stay updated with the latest insights and tips.`,
    slug: `/blog/category/${categorySlug}`,
    contentId: category._id,
    contentType: "category"
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || "1", 10);

  if (currentPage < 1 || !Number.isInteger(currentPage)) {
    notFound();
  }

  const [categoryRes, blogsRes, categoriesRes] = await Promise.all([
    fetchCategoryData(categorySlug),
    fetchCategoryBlogs(categorySlug, currentPage),
    fetchCategories()
  ]);

  const [category, categoryErr] = categoryRes;
  const [blogsData, blogsErr] = blogsRes;
  const [categories] = categoriesRes;

  if (categoryErr || !category?.data || blogsErr || !blogsData?.data) {
    notFound();
  }

  const { blogs = [], totalCount = 0 } = blogsData.data;
  const categoryData = category.data;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const hasBlogs = blogs.length > 0;
  const showPagination = totalPages > 1;

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <CategoryHeader category={categoryData} />
        
        <CategoryNavigation 
          categories={categories?.data || []} 
          activeCategory={categorySlug}
        />

        {hasBlogs ? (
          <>
            <BlogGrid blogs={blogs} />
            <div className="mt-12 space-y-6">
              <PaginationInfo
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                itemsPerPage={POSTS_PER_PAGE}
                currentItemsCount={blogs.length}
              />
              {showPagination && (
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/blog/category/${categorySlug}`}
                />
              )}
            </div>
          </>
        ) : (
          <EmptyState category={categoryData} />
        )}
      </div>
    </main>
  );
}

interface CategoryHeaderProps {
  category: Category;
}

function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        {category.icon && (
          <span className="text-2xl" role="img" aria-label={category.title}>
            {category.icon}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {category.title}
        </h1>
      </div>
      
      {category.description && (
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {category.description}
        </p>
      )}
    </div>
  );
}

interface BlogGridProps {
  blogs: Blog[];
}

function BlogGrid({ blogs }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 xl:grid-cols-3 mt-12">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  currentItemsCount: number;
}

function PaginationInfo({ 
  currentPage, 
  totalPages, 
  totalCount, 
  itemsPerPage, 
  currentItemsCount 
}: PaginationInfoProps) {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = startItem + currentItemsCount - 1;
  
  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-6">
      <div>
        Showing {startItem}–{endItem} of {totalCount} article{totalCount !== 1 ? 's' : ''}
      </div>
      <div>
        Page {currentPage} of {Math.max(totalPages, 1)}
      </div>
    </div>
  );
}

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

function SimplePagination({ currentPage, totalPages, baseUrl }: SimplePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2));

  return (
    <div className="mt-16 flex justify-center">
      <nav className="flex items-center gap-2">
        {currentPage > 1 && (
          <Link
            href={`${baseUrl}?page=${currentPage - 1}`}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Previous
          </Link>
        )}
        
        {showPages.map((page) => (
          <Link
            key={page}
            href={page === 1 ? baseUrl : `${baseUrl}?page=${page}`}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {currentPage < totalPages && (
          <Link
            href={`${baseUrl}?page=${currentPage + 1}`}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

interface EmptyStateProps {
  category: Category;
}

function EmptyState({ category }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
        {category.icon ? (
          <span className="text-3xl" role="img" aria-label={category.title}>
            {category.icon}
          </span>
        ) : (
          <div className="w-10 h-10 border-2 border-dashed border-muted-foreground rounded-full" />
        )}
      </div>
      
      <h2 className="text-2xl font-semibold mb-3">
        No articles yet in {category.title}
      </h2>
      
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        We're working on adding content to this category. 
        Check back soon or explore other categories.
      </p>
      
      <Link 
        href="/blog" 
        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Browse All Articles
      </Link>
    </div>
  );
}