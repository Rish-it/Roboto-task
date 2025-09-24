"use client";

import { useState } from "react";
import Link from "next/link";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { BlogCard, FeaturedBlogCard } from "@/components/blog-card";
import { ViewToggle } from "@/components/view-toggle";
import { urlFor } from "@/lib/sanity/client";

type ViewType = "grid" | "carousel";

interface BlogViewContainerProps {
  featuredBlogs: any[];
  remainingBlogs: any[];
  categories?: any[];
}

export function BlogViewContainer({ 
  featuredBlogs, 
  remainingBlogs
}: BlogViewContainerProps) {
  const [currentView, setCurrentView] = useState<ViewType>("grid");
  
  // Combine all blogs for carousel view
  const allBlogs = [...featuredBlogs, ...remainingBlogs];

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="mt-8">
      {/* View Toggle - positioned above the content */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {currentView === "carousel" ? "Featured Stories" : "Latest Posts"}
        </h2>
        <ViewToggle onViewChange={handleViewChange} defaultView="grid" />
      </div>

      {currentView === "carousel" ? (
        <CarouselView blogs={allBlogs} />
      ) : (
        <GridView featuredBlogs={featuredBlogs} remainingBlogs={remainingBlogs} />
      )}
    </div>
  );
}

interface CarouselViewProps {
  blogs: any[];
}

function CarouselView({ blogs }: CarouselViewProps) {
  // Get icon with fallbacks based on category name
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

  const cards = blogs.map((blog, index) => {
    const categoryTitle = blog.category?.title || "General";
    const iconName = blog.category?.icon || getDefaultIcon(categoryTitle);
    
    return (
      <Card 
        key={blog._id} 
        card={{
          src: blog.image?.asset ? urlFor(blog.image as any).width(800).height(600).url() : "https://images.unsplash.com/photo-1593508512255-86ab42a8e620",
          title: blog.title || "Untitled",
          category: categoryTitle,
          categoryIcon: iconName,
          content: (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={blog.image?.asset ? urlFor(blog.image as any).width(600).height(400).url() : "https://images.unsplash.com/photo-1593508512255-86ab42a8e620"}
                alt={blog.title || "Blog image"}
                className="w-full h-64 md:h-80 object-cover rounded-2xl"
              />
            </div>
            
            {/* Content */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed mb-6">
                  {blog.description}
                </p>
                
                {/* Meta info */}
                {(blog.publishedAt || blog.authors) && (
                  <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                    {blog.publishedAt && (
                      <span>
                        {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                    {blog.authors && <span>By {blog.authors.name}</span>}
                  </div>
                )}
              </div>
              
              {/* Read Full Article Button - Right aligned */}
              <div className="flex justify-end">
                <Link 
                  href={blog.slug || "#"}
                  className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Read Full Article
                </Link>
              </div>
            </div>
          </div>
        ),
      }} 
      index={index} 
      layout={true}
    />
  );
  });

  return (
    <div className="w-full">
      <Carousel items={cards} />
    </div>
  );
}

interface GridViewProps {
  featuredBlogs: any[];
  remainingBlogs: any[];
}

function GridView({ featuredBlogs, remainingBlogs }: GridViewProps) {
  return (
    <>
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
    </>
  );
}