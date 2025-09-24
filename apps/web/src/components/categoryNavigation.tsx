import { cn } from "@workspace/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { useCategoryFiltering } from "@/hooks/useCategoryFiltering";
import { 
  type CategoryData,
  getCategoryIcon,
  getCategoryColorClass 
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
  const IconComponent = getCategoryIcon(category.icon);
  const colorClass = getCategoryColorClass(category.color);

  return (
    <Link href={`/blog/category/${category.slug}`} className="group">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-medium border transition-all duration-200 hover:shadow-sm",
          "text-foreground text-xs px-2.5 py-1 rounded-full",
          isActive ? "ring-2 ring-primary/20 bg-primary/10" : "",
          colorClass
        )}
      >
        {IconComponent && (
          <IconComponent className="h-3 w-3 flex-shrink-0" />
        )}
        {category.title}
        <span className="text-xs opacity-75">
          ({category.postCount})
        </span>
      </span>
    </Link>
  );
}); 