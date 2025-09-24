import { notFound } from "next/navigation";
import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { PageBuilder } from "@/components/pagebuilder";
import { SearchWrapper } from "@/components/search/searchWrapper";
import { SearchInput } from "@/components/search/searchInput";
import { SearchCategoryBar } from "@/components/search-category-bar";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData, queryCategoriesList } from "@/lib/sanity/query";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

async function fetchCategories() {
  return await handleErrors(sanityFetch({ query: queryCategoriesList }));
}

export async function generateMetadata() {
  const { data: result } = await sanityFetch({
    query: queryBlogIndexPageData,
    stega: false,
  });
  return getSEOMetadata(
    result
      ? {
          title: result?.title ?? result?.seoTitle ?? "",
          description: result?.description ?? result?.seoDescription ?? "",
          slug: result?.slug,
          contentId: result?._id,
          contentType: result?._type,
        }
      : {},
  );
}

export default async function BlogIndexPage() {
  const [res, err] = await fetchBlogPosts();
  const [categoriesRes] = await fetchCategories();
  if (err || !res?.data) notFound();

  const {
    blogs = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    displayFeaturedBlogs,
    featuredBlogsCount,
  } = res.data;

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount)
    : 0;

  if (!blogs.length) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No blog posts available at the moment.
          </p>
        </div>
        {pageBuilder && pageBuilder.length > 0 && (
          <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
        )}
      </main>
    );
  }

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  const featuredBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(0, validFeaturedBlogsCount)
    : [];
  const remainingBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(validFeaturedBlogsCount)
    : blogs;

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        <SearchWrapper className="mt-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
            <SearchCategoryBar categories={categoriesRes?.data || []} />
            <div className="flex-1 max-w-md">
              <SearchInput placeholder="Search blog posts..." className="w-full" />
            </div>
          </div>
          <BlogList 
            featuredBlogs={featuredBlogs}
            remainingBlogs={remainingBlogs}
          />
        </SearchWrapper>
      </div>
      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}

interface BlogListProps {
  featuredBlogs: any[];
  remainingBlogs: any[];
}

function BlogList({ featuredBlogs, remainingBlogs }: BlogListProps) {
  return (
    <div className="mt-12">
      {featuredBlogs.length > 0 && (
        <div className="mx-auto mb-12 lg:mb-20 grid grid-cols-1 gap-8 md:gap-12">
          {featuredBlogs.map((blog) => (
            <FeaturedBlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
      {remainingBlogs.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">
          {remainingBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}