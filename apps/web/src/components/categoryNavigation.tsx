import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";
import { 
  type CategoryData,
  getCategoryIcon 
} from "@/utils/categoryUtils";

interface CategoryNavigationProps {
  categories: CategoryData[];
  className?: string;
  maxDisplay?: number;
  activeCategory?: string;
}

export const CategoryNavigation = memo<CategoryNavigationProps>(function CategoryNavigation({
  categories,
  className,
  maxDisplay = 6,
  activeCategory,
}) {
  const { displayCategories, hasMoreCategories } = useCategoryFiltering({
    categories,
    maxDisplay,
  });

  if (!displayCategories.length) {
    return null;
  }

  return (
    <div className={cn("mt-8 mb-6", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Browse by category:
        </span>
        
        <div className="flex flex-wrap gap-2">
          {displayCategories.map((category) => (
            <CategoryNavigationItem 
              key={category._id} 
              category={category}
              isActive={activeCategory === category.slug}
            />
          ))}
          
          {hasMoreCategories && (
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
});

interface CategoryNavigationItemProps {
  category: CategoryData;
  isActive?: boolean;
}

const CategoryNavigationItem = memo<CategoryNavigationItemProps>(function CategoryNavigationItem({
  category,
  isActive = false,
}) {
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
  
  const IconComponent = getCategoryIcon(category.icon || undefined) || getCategoryIcon(getDefaultIcon(category.title));
  
  // Simple button style without colors
  const getButtonStyle = (active: boolean) => {
    if (active) {
      return "bg-primary text-primary-foreground shadow hover:bg-primary/90";
    }
    return "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 shadow-sm";
  };

  return (
    <Link href={`/blog/category/${category.slug}`} className="group">
      <span
        className={cn(
          "inline-flex items-center gap-2 font-medium transition-all duration-200",
          "text-sm px-4 py-2 rounded-md",
          "hover:shadow-md transform hover:scale-105",
          getButtonStyle(isActive)
        )}
      >
        {IconComponent && (
          <IconComponent className="h-4 w-4 flex-shrink-0" />
        )}
        {category.title}
        <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
          {category.postCount}
        </span>
      </span>
    </Link>
  );
}); 