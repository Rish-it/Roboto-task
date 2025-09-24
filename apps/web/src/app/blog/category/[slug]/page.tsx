import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogCard, BlogHeader } from "@/components/blog-card";
import { CategoryNavigation } from "@/components/categoryNavigation";
import { Pagination } from "@/components/pagination";
import { sanityFetch } from "@/lib/sanity/live";
import { 
  queryCategoryBySlug, 
  queryBlogsByCategory, 
  queryCategoriesList 
} from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const POSTS_PER_PAGE = 12;

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

  // Validate page number
  if (currentPage < 1 || !Number.isInteger(currentPage)) {
    notFound();
  }

  // Fetch data in parallel
  const [categoryRes, blogsRes, categoriesRes] = await Promise.all([
    fetchCategoryData(categorySlug),
    fetchCategoryBlogs(categorySlug, currentPage),
    fetchCategories()
  ]);

  // Handle errors
  const [category, categoryErr] = categoryRes;
  const [blogsData, blogsErr] = blogsRes;
  const [categories] = categoriesRes;

  if (categoryErr || !category?.data || blogsErr || !blogsData?.data) {
    notFound();
  }

  const { blogs = [], totalCount = 0 } = blogsData.data;
  const categoryData = category.data;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  // Validate page bounds
  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  const hasBlogs = blogs.length > 0;
  const showPagination = totalPages > 1;

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <CategoryHeader category={categoryData} totalCount={totalCount} />
        
        <CategoryNavigation 
          categories={categories?.data || []} 
          activeCategory={categorySlug}
        />

        {hasBlogs ? (
          <>
            <BlogGrid blogs={blogs} />
            {showPagination && (
              <div className="mt-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={`/blog/category/${categorySlug}`}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState category={categoryData} />
        )}
      </div>
    </main>
  );
}

interface CategoryHeaderProps {
  category: any;
  totalCount: number;
}

function CategoryHeader({ category, totalCount }: CategoryHeaderProps) {
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
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          {category.description}
        </p>
      )}
      
      <div className="text-sm text-muted-foreground">
        {totalCount} article{totalCount !== 1 ? 's' : ''} in this category
      </div>
    </div>
  );
}

interface BlogGridProps {
  blogs: any[];
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

interface EmptyStateProps {
  category: any;
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
      
      <a 
        href="/blog" 
        className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Browse All Articles
      </a>
    </div>
  );
}