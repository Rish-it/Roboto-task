import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

interface Category {
  _id: string;
  title: string;
  slug: string;
  color: string;
  icon?: string;
  featured: boolean;
  postCount: number;
}

interface CategoryNavigationProps {
  categories: Category[];
  className?: string;
}

const textColorVariants = {
  blue: "text-blue-800",
  green: "text-green-800",
  purple: "text-purple-800",
  red: "text-red-800",
  orange: "text-orange-800",
  yellow: "text-yellow-800",
  pink: "text-pink-800",
  gray: "text-gray-800",
} as const;

export function CategoryNavigation({ 
  categories, 
  className 
}: CategoryNavigationProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Show featured categories first, then up to 6 total
  const featuredCategories = categories.filter((cat: Category) => cat.featured);
  const remainingCategories = categories.filter((cat: Category) => !cat.featured);
  const displayCategories = [
    ...featuredCategories,
    ...remainingCategories.slice(0, Math.max(0, 6 - featuredCategories.length))
  ];

  return (
    <div className={cn("mt-8 mb-6", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Browse by category:
        </span>
        
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category) => {
            const IconComponent = category.icon && category.icon in LucideIcons 
              ? (LucideIcons as any)[category.icon]
              : null;
              
            const textColorClass = textColorVariants[category.color as keyof typeof textColorVariants] || textColorVariants.blue;
            
            return (
              <Link
                key={category._id}
                href={`/blog/${category.slug}`}
                className="group"
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "inline-flex items-center gap-1.5 font-medium border transition-colors hover:shadow-sm",
                    textColorClass
                  )}
                >
                  {IconComponent && (
                    <IconComponent className="h-3 w-3 flex-shrink-0" />
                  )}
                  {category.title}
                  <span className="text-xs opacity-75">
                    ({category.postCount})
                  </span>
                </Badge>
              </Link>
            );
          })}
          
          {categories.length > 6 && (
            <Link
              href="/blog/categories"
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all categories
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 