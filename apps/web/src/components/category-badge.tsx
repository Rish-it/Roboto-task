import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import * as LucideIcons from "lucide-react";

interface CategoryBadgeProps {
  title: string;
  color?: string;
  icon?: string;
  size?: "small" | "medium" | "large";
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

const sizeVariants = {
  small: "text-xs px-2 py-1",
  medium: "text-sm px-3 py-1",
  large: "text-base px-4 py-2",
} as const;

export function CategoryBadge({
  title,
  color = "blue",
  icon,
  size = "medium",
  className,
}: CategoryBadgeProps) {
  const IconComponent = icon && icon in LucideIcons 
    ? (LucideIcons as any)[icon]
    : null;

  const textColorClass = textColorVariants[color as keyof typeof textColorVariants] || textColorVariants.blue;
  const sizeClass = sizeVariants[size];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border transition-colors",
        textColorClass,
        sizeClass,
        className
      )}
    >
      {IconComponent && (
        <IconComponent 
          className={cn(
            "flex-shrink-0",
            size === "small" && "h-3 w-3",
            size === "medium" && "h-4 w-4", 
            size === "large" && "h-5 w-5"
          )} 
        />
      )}
      {title}
    </Badge>
  );
} 