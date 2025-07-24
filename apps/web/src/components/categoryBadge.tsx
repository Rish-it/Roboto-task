import { cn } from "@workspace/ui/lib/utils";
import { memo } from "react";

import { 
  type CategoryColor, 
  type CategorySize,
  getCategoryIcon,
  getCategoryColorClass,
  getCategorySizeClass,
  getCategoryIconSize
} from "@/utils/categoryUtils";

interface CategoryBadgeProps {
  title: string;
  color?: CategoryColor;
  icon?: string;
  size?: CategorySize;
  className?: string;
}

export const CategoryBadge = memo<CategoryBadgeProps>(function CategoryBadge({
  title,
  color = "blue",
  icon,
  size = "medium",
  className,
}) {
  const IconComponent = getCategoryIcon(icon);
  const colorClass = getCategoryColorClass(color);
  const sizeClass = getCategorySizeClass(size);
  const iconSizeClass = getCategoryIconSize(size);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border transition-all duration-200",
        "text-foreground", // Use default text color for legibility
        colorClass,
        sizeClass,
        className
      )}
    >
      {IconComponent && (
        <IconComponent className={cn("flex-shrink-0", iconSizeClass)} />
      )}
      {title}
    </span>
  );
}); 