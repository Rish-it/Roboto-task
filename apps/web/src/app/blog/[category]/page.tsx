import { notFound } from "next/navigation";

import { BlogCard, BlogHeader } from "@/components/blog-card";
import { CategoryBadge } from "@/components/category-badge";
import { SearchWrapper } from "@/components/search/search-wrapper";
import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCategoryPageData, queryCategoryPaths } from "@/lib/sanity/query";
import type { QueryBlogIndexPageDataResult } from "@/lib/sanity/sanity.types";
import { getSEOMetadata } from "@/lib/seo";
import { handleErrors } from "@/utils";

type Blog = NonNullable<
  NonNullable<QueryBlogIndexPageDataResult>["blogs"]
>[number];

async function fetchCategoryPageData(categorySlug: string, stega = true) {
  return await handleErrors(
    sanityFetch({
      query: queryCategoryPageData,
      params: { categorySlug },
      stega,
    })
  );
}

async function fetchCategoryPaths() {
  const slugs = await client.fetch(queryCategoryPaths);
  const paths: { category: string }[] = [];
  for (const slug of slugs) {
    if (slug) paths.push({ category: slug });
  }
  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [res] = await fetchCategoryPageData(category, false);
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

export async function generateStaticParams() {
  return await fetchCategoryPaths();
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const [res, err] = await fetchCategoryPageData(category);
  
  if (err || !res?.data) {
    return notFound();
  }

  const { title, description, blogs = [], color, icon, _id, _type } = res.data;

  const filteredBlogs = blogs.filter(
    (blog: Blog) => blog?.category?.slug === category
  );

  if (filteredBlogs.length !== blogs.length) {
    console.warn(
      `Some blogs did not match the selected category (${category}). Filtering client-side.`,
      { blogs, filteredBlogs }
    );
  }

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        {/* Category Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <CategoryBadge
              title={title}
              color={color}
              icon={icon}
              size="large"
            />
          </div>
          <BlogHeader 
            title={`${title} Blog Posts`}
            description={description || `Discover all our blog posts about ${title}`}
          />
        </div>

        {/* Search Component */}
        <SearchWrapper categorySlug={category} />

        {/* Blog Posts */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {filteredBlogs.map((blog: Blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No blog posts found in the {title} category yet.
            </p>
            {blogs.length > 0 && (
              <p className="text-xs text-red-500 mt-2">
                Warning: Some posts were excluded because they did not match the selected category.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 